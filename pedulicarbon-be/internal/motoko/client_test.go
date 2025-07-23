package motoko

import (
	"context"
	"os"
	"testing"
	"time"
)

func TestMintNFTandQuery(t *testing.T) {
	canisterHost := os.Getenv("ICP_CANISTER_HOST")
	canisterID := os.Getenv("ICP_CANISTER_ID")
	if canisterHost == "" || canisterID == "" {
		t.Skip("Set ICP_CANISTER_HOST dan ICP_CANISTER_ID di env")
	}
	client := NewMotokoClient(canisterHost, canisterID)

	// principal dummy, ganti dengan principal Anda jika perlu
	userPrincipal := "aaaaa-aa" // principal anonymous, untuk test local
	missionID := uint(1)
	carbonAmount := 1.23

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	nftID, err := client.MintNFT(ctx, userPrincipal, missionID, carbonAmount)
	if err != nil {
		t.Fatalf("MintNFT error: %v", err)
	}
	t.Logf("Minted NFT ID: %s", nftID)

	nftIDs, err := client.GetUserNFTs(ctx, userPrincipal)
	if err != nil {
		t.Fatalf("GetUserNFTs error: %v", err)
	}
	if len(nftIDs) == 0 {
		t.Fatalf("NFT user kosong, mint gagal?")
	}
	found := false
	for _, id := range nftIDs {
		if id == nftID {
			found = true
		}
	}
	if !found {
		t.Fatalf("NFT ID %s tidak ditemukan di NFT user", nftID)
	}
	t.Logf("NFT user: %v", nftIDs)
}
