package service

import (
	"context"
	"fmt"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/motoko"
	"pedulicarbon/internal/repository"
	"time"
)

type MissionTakenService struct {
	MissionTakenRepo *repository.MissionTakenRepository
	UserRepo         *repository.UserRepository
	MissionRepo      *repository.MissionRepository
	MotokoClient     *motoko.MotokoClient
	UserNFTRepo      *repository.UserNFTRepository
}

func NewMissionTakenService(repo *repository.MissionTakenRepository, userRepo *repository.UserRepository, missionRepo *repository.MissionRepository, motokoClient *motoko.MotokoClient, userNFTRepo *repository.UserNFTRepository) *MissionTakenService {
	return &MissionTakenService{
		MissionTakenRepo: repo,
		UserRepo:         userRepo,
		MissionRepo:      missionRepo,
		MotokoClient:     motokoClient,
		UserNFTRepo:      userNFTRepo,
	}
}

func (s *MissionTakenService) TakeMission(mt *model.MissionTaken) error {
	return s.MissionTakenRepo.TakeMission(mt)
}

func (s *MissionTakenService) GetUserMissions(userID uint) ([]model.MissionTaken, error) {
	return s.MissionTakenRepo.GetUserMissions(userID)
}

func (s *MissionTakenService) UpdateProof(mtID uint, proofURL, gps string) error {
	return s.MissionTakenRepo.UpdateProof(mtID, proofURL, gps)
}

func (s *MissionTakenService) VerifyMission(mtID uint) error {
	// Ambil data MissionTaken, User, Mission
	mt, err := s.MissionTakenRepo.GetByID(mtID)
	if err != nil {
		fmt.Printf("[ERROR] GetByID error: %v\n", err)
		return err
	}
	user, err := s.UserRepo.GetUserByID(mt.UserID)
	if err != nil {
		fmt.Printf("[ERROR] GetUserByID error: %v\n", err)
		return err
	}
	if user.IIPrincipal == "" {
		fmt.Println("[ERROR] user belum punya ii_principal (ICP principal)")
		return fmt.Errorf("user belum punya ii_principal (ICP principal)")
	}
	mission, err := s.MissionRepo.GetMissionByID(mt.MissionID)
	if err != nil {
		fmt.Printf("[ERROR] GetMissionByID error: %v\n", err)
		return err
	}

	// Step 1: Verify Action di Motoko
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	fmt.Printf("[DEBUG] Calling VerifyAction for user: %s, mission: %d, proof: %s, gps: %s\n",
		user.IIPrincipal, mt.MissionID, mt.ProofURL, mt.GPS)

	verified, err := s.MotokoClient.VerifyAction(ctx, user.IIPrincipal, mt.MissionID, mt.ProofURL, mt.GPS)
	if err != nil {
		fmt.Printf("[ERROR] VerifyAction error: %v\n", err)
		return err
	}

	if !verified {
		fmt.Printf("[ERROR] Mission verification failed on canister\n")
		return fmt.Errorf("mission verification failed on canister")
	}

	fmt.Printf("[DEBUG] Mission verified on canister: %v\n", verified)

	// Step 2: Update status di DB
	err = s.MissionTakenRepo.VerifyMission(mtID)
	if err != nil {
		fmt.Printf("[ERROR] VerifyMissionRepo error: %v\n", err)
		return err
	}

	// Step 3: Mint NFT ke Motoko
	nftID, err := s.MotokoClient.MintNFT(ctx, user.IIPrincipal, mt.MissionID, mission.AssetAmount)
	if err != nil {
		fmt.Printf("[ERROR] MintNFT error: %v\n", err)
		return err
	}

	fmt.Printf("[DEBUG] NFT minted successfully: %s\n", nftID)

	// Step 4: Simpan mapping NFT ke user
	userNFT := &model.UserNFT{
		UserID: user.ID,
		NFTID:  nftID,
		Status: "owned",
	}
	if err := s.UserNFTRepo.CreateUserNFT(userNFT); err != nil {
		fmt.Printf("[ERROR] CreateUserNFT error: %v\n", err)
		return err
	}

	// Step 5: Tambah point ke user
	if mission.Points > 0 {
		// Reload user dari DB untuk dapat point terbaru
		userLatest, err := s.UserRepo.GetUserByID(user.ID)
		if err != nil {
			fmt.Printf("[ERROR] GetUserByID (latest) error: %v\n", err)
			return err
		}
		newPoints := userLatest.Points + mission.Points
		if err := s.UserRepo.UpdateUserPoints(user.ID, newPoints); err != nil {
			fmt.Printf("[ERROR] UpdateUserPoints error: %v\n", err)
			return err
		}
		fmt.Printf("[DEBUG] User %d point updated: %d -> %d\n", user.ID, userLatest.Points, newPoints)
	} else {
		// If mission has no points, add default points
		userLatest, err := s.UserRepo.GetUserByID(user.ID)
		if err != nil {
			fmt.Printf("[ERROR] GetUserByID (latest) error: %v\n", err)
			return err
		}
		newPoints := userLatest.Points + 10 // Default 10 points
		if err := s.UserRepo.UpdateUserPoints(user.ID, newPoints); err != nil {
			fmt.Printf("[ERROR] UpdateUserPoints error: %v\n", err)
			return err
		}
		fmt.Printf("[DEBUG] User %d point updated (default): %d -> %d\n", user.ID, userLatest.Points, newPoints)
	}

	fmt.Printf("[DEBUG] Mission verification completed successfully\n")
	return nil
}

func (s *MissionTakenService) ClaimNFT(userID uint, nftID string, certificateURL string) error {
	// Ambil user_nft by NFTID
	userNFT, err := s.UserNFTRepo.GetUserNFTByNFTID(nftID)
	if err != nil {
		return fmt.Errorf("NFT tidak ditemukan")
	}
	if userNFT.Status != "owned" {
		return fmt.Errorf("NFT sudah claimed")
	}
	// Burn NFT di Motoko
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := s.MotokoClient.BurnNFT(ctx, nftID); err != nil {
		return err
	}
	now := time.Now()
	userNFT.Status = "claimed"
	userNFT.ClaimedBy = &userID
	userNFT.ClaimedAt = &now
	userNFT.CertificateURL = certificateURL
	return s.UserNFTRepo.UpdateUserNFT(userNFT)
}
