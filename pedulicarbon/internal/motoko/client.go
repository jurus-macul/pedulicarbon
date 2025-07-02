package motoko

import (
	"context"
)

type MotokoClient struct {
	CanisterURL string
}

func NewMotokoClient(canisterURL string) *MotokoClient {
	return &MotokoClient{CanisterURL: canisterURL}
}

func (c *MotokoClient) VerifyAction(ctx context.Context, userPrincipal string, missionID uint, proofURL, gps string) (bool, error) {
	// Dummy: always true, siap diisi call HTTP ke canister
	return true, nil
}

func (c *MotokoClient) MintNFT(ctx context.Context, userPrincipal string, missionID uint, carbonAmount float64) (string, error) {
	// Dummy: return NFT ID, siap diisi call HTTP ke canister
	return "NFT-123", nil
}

func (c *MotokoClient) GetUserNFTs(ctx context.Context, userPrincipal string) ([]string, error) {
	// Dummy: return list NFT ID
	return []string{"NFT-123", "NFT-456"}, nil
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
