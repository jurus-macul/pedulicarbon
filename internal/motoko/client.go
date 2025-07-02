package motoko

import (
	"context"
	"net/url"
	"os"

	agentgo "github.com/aviate-labs/agent-go"
	"github.com/aviate-labs/agent-go/principal"
)

type MotokoClient struct {
	CanisterURL string
	CanisterID  string
}

func NewMotokoClient(canisterURL, canisterID string) *MotokoClient {
	return &MotokoClient{CanisterURL: canisterURL, CanisterID: canisterID}
}

func (c *MotokoClient) VerifyAction(ctx context.Context, userPrincipal string, missionID uint, proofURL, gps string) (bool, error) {
	// Dummy: always true, siap diisi call HTTP ke canister
	return true, nil
}

func (c *MotokoClient) MintNFT(ctx context.Context, userPrincipal string, missionID uint, carbonAmount float64) (string, error) {
	host, _ := url.Parse(os.Getenv("ICP_CANISTER_HOST")) // e.g. http://127.0.0.1:4943
	ag, err := agentgo.New(agentgo.Config{
		ClientConfig: []agentgo.ClientOption{agentgo.WithHostURL(host)},
		FetchRootKey: true, // true untuk local dev ICP
	})
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
	host, _ := url.Parse(os.Getenv("ICP_CANISTER_HOST"))
	ag, err := agentgo.New(agentgo.Config{
		ClientConfig: []agentgo.ClientOption{agentgo.WithHostURL(host)},
		FetchRootKey: true,
	})
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
