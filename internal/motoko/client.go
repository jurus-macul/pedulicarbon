package motoko

import (
	"context"
	"fmt"
	"net/url"

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
	host, _ := url.Parse(c.CanisterURL)
	ag, err := agentgo.New(agentgo.Config{
		ClientConfig: []agentgo.ClientOption{agentgo.WithHostURL(host)},
		FetchRootKey: true, // true untuk local dev ICP
	})
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
	host, _ := url.Parse(c.CanisterURL)
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
	host, _ := url.Parse(c.CanisterURL)
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

func (c *MotokoClient) BurnNFT(ctx context.Context, nftID string) error {
	host, _ := url.Parse(c.CanisterURL)
	ag, err := agentgo.New(agentgo.Config{
		ClientConfig: []agentgo.ClientOption{agentgo.WithHostURL(host)},
		FetchRootKey: true,
	})
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
