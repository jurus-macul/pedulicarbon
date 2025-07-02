package motoko

import (
	"context"
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"

	agentgo "github.com/aviate-labs/agent-go"
	"github.com/aviate-labs/agent-go/identity"
	"github.com/aviate-labs/agent-go/principal"
)

type MotokoClient struct {
	CanisterURL string
	CanisterID  string
	Identity    identity.Identity
}

func NewMotokoClient(canisterURL, canisterID string) *MotokoClient {
	return &MotokoClient{CanisterURL: canisterURL, CanisterID: canisterID}
}

// createIdentityFromPEM creates an Ed25519 identity from PEM file with passphrase support
func (c *MotokoClient) createIdentityFromPEM(identityPath, passphrase string) (identity.Identity, error) {
	pemData, err := os.ReadFile(identityPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read PEM file: %v", err)
	}

	block, _ := pem.Decode(pemData)
	if block == nil {
		return nil, fmt.Errorf("failed to decode PEM block")
	}

	var privateKeyBytes []byte
	if x509.IsEncryptedPEMBlock(block) {
		privateKeyBytes, err = x509.DecryptPEMBlock(block, []byte(passphrase))
		if err != nil {
			return nil, fmt.Errorf("failed to decrypt PEM block: %v", err)
		}
	} else {
		privateKeyBytes = block.Bytes
	}

	// Parse the private key based on PEM type
	var privateKey ed25519.PrivateKey
	if block.Type == "PRIVATE KEY" {
		// PKCS#8 format
		key, err := x509.ParsePKCS8PrivateKey(privateKeyBytes)
		if err != nil {
			return nil, fmt.Errorf("failed to parse PKCS#8 private key: %v", err)
		}
		if edKey, ok := key.(ed25519.PrivateKey); ok {
			privateKey = edKey
		} else {
			return nil, fmt.Errorf("private key is not Ed25519")
		}
	} else if block.Type == "EC PRIVATE KEY" {
		// EC (secp256k1) format - convert to Ed25519
		privateKeyValue, err := extractECPrivateKeyValue(privateKeyBytes)
		if err != nil {
			return nil, fmt.Errorf("failed to extract EC private key value: %v", err)
		}

		// Convert to Ed25519 by using the private key bytes as seed
		seed := make([]byte, 32)
		copy(seed, privateKeyValue.Bytes())
		privateKey = ed25519.NewKeyFromSeed(seed)
	} else if block.Type == "OPENSSH PRIVATE KEY" {
		// OpenSSH format - extract Ed25519 key
		if len(privateKeyBytes) >= 32 {
			privateKey = ed25519.NewKeyFromSeed(privateKeyBytes[:32])
		} else {
			return nil, fmt.Errorf("invalid OpenSSH private key format")
		}
	} else {
		return nil, fmt.Errorf("unsupported PEM type: %s", block.Type)
	}

	// Create identity from private key
	id, err := identity.NewEd25519Identity(privateKey.Public().(ed25519.PublicKey), privateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create identity: %v", err)
	}

	return id, nil
}

// extractECPrivateKeyValue extracts the private key value from EC private key ASN.1 DER
func extractECPrivateKeyValue(data []byte) (*big.Int, error) {
	// EC Private Key ASN.1 structure:
	// SEQUENCE {
	//   version INTEGER,
	//   privateKey OCTET STRING,
	//   parameters [0] EXPLICIT ECDomainParameters OPTIONAL,
	//   publicKey [1] EXPLICIT BIT STRING OPTIONAL
	// }

	if len(data) < 2 || data[0] != 0x30 {
		return nil, fmt.Errorf("invalid ASN.1 sequence")
	}

	// Skip sequence header and length
	offset := 2

	// Skip version (first INTEGER)
	if offset >= len(data) || data[offset] != 0x02 {
		return nil, fmt.Errorf("expected version INTEGER")
	}
	offset++
	if offset >= len(data) {
		return nil, fmt.Errorf("unexpected end of data")
	}
	versionLen := int(data[offset])
	offset++
	offset += versionLen

	// Get private key (second INTEGER)
	if offset >= len(data) || data[offset] != 0x04 { // OCTET STRING
		return nil, fmt.Errorf("expected private key OCTET STRING")
	}
	offset++
	if offset >= len(data) {
		return nil, fmt.Errorf("unexpected end of data")
	}
	privateKeyLen := int(data[offset])
	offset++
	if offset+privateKeyLen > len(data) {
		return nil, fmt.Errorf("invalid private key length")
	}

	// Convert to big.Int
	privateKeyValue := new(big.Int).SetBytes(data[offset : offset+privateKeyLen])
	return privateKeyValue, nil
}

// createAgent creates an agent with identity from PEM file
func (c *MotokoClient) createAgent() (*agentgo.Agent, error) {
	// Get identity path and passphrase from environment
	identityPath := os.Getenv("IDENTITY_PATH")
	passphrase := os.Getenv("IDENTITY_PASSPHRASE")
	if passphrase == "" {
		passphrase = "pedulicarbon" // default passphrase
	}

	if identityPath == "" {
		return nil, fmt.Errorf("IDENTITY_PATH environment variable not set")
	}

	// Create identity from PEM
	id, err := c.createIdentityFromPEM(identityPath, passphrase)
	if err != nil {
		return nil, fmt.Errorf("failed to create identity: %v", err)
	}

	// Create agent
	ag, err := agentgo.New(agentgo.Config{
		Identity: id,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create agent: %v", err)
	}

	return ag, nil
}

func (c *MotokoClient) VerifyAction(ctx context.Context, userPrincipal string, missionID uint, proofURL, gps string) (bool, error) {
	ag, err := c.createAgent()
	if err != nil {
		return false, err
	}

	p, err := principal.Decode(userPrincipal)
	if err != nil {
		return false, err
	}
	var result bool
	err = ag.Call(
		principal.MustDecode(c.CanisterID),
		"verify_action",
		[]any{p, missionID, proofURL, gps},
		[]any{&result},
	)
	if err != nil {
		return false, err
	}
	return result, nil
}

func (c *MotokoClient) MintNFT(ctx context.Context, userPrincipal string, missionID uint, carbonAmount float64) (string, error) {
	ag, err := c.createAgent()
	if err != nil {
		return "", err
	}

	p, err := principal.Decode(userPrincipal)
	if err != nil {
		return "", err
	}
	var nftID string
	err = ag.Call(
		principal.MustDecode(c.CanisterID),
		"mint_nft",
		[]any{p, missionID, carbonAmount},
		[]any{&nftID},
	)
	if err != nil {
		return "", err
	}
	return nftID, nil
}

func (c *MotokoClient) GetUserNFTs(ctx context.Context, userPrincipal string) ([]string, error) {
	ag, err := c.createAgent()
	if err != nil {
		return nil, err
	}

	p, err := principal.Decode(userPrincipal)
	if err != nil {
		return nil, err
	}
	var nftIDs []string
	err = ag.Query(
		principal.MustDecode(c.CanisterID),
		"get_user_nfts",
		[]any{p},
		[]any{&nftIDs},
	)
	if err != nil {
		return nil, err
	}
	return nftIDs, nil
}

func (c *MotokoClient) GetNFTDetail(ctx context.Context, nftID string) (map[string]interface{}, error) {
	// Dummy: return NFT detail
	return map[string]interface{}{
		"id":            nftID,
		"owner":         "principal-abc",
		"mission_id":    1,
		"carbon_amount": 1.2,
		"timestamp":     1234567890,
	}, nil
}

func (c *MotokoClient) BurnNFT(ctx context.Context, nftID string) error {
	ag, err := c.createAgent()
	if err != nil {
		return err
	}

	var result bool
	err = ag.Call(
		principal.MustDecode(c.CanisterID),
		"burn_nft",
		[]any{nftID},
		[]any{&result},
	)
	if err != nil {
		return err
	}
	if !result {
		return fmt.Errorf("burn_nft failed on canister")
	}
	return nil
}
