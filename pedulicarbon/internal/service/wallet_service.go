package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type WalletService struct {
	WalletRepo *repository.WalletRepository
}

func NewWalletService(walletRepo *repository.WalletRepository) *WalletService {
	return &WalletService{WalletRepo: walletRepo}
}

func (s *WalletService) GetWallet(userID uint) (*model.Wallet, error) {
	return s.WalletRepo.GetWalletByUserID(userID)
}

func (s *WalletService) CreateWallet(wallet *model.Wallet) error {
	return s.WalletRepo.CreateWallet(wallet)
}

func (s *WalletService) UpdateWallet(wallet *model.Wallet) error {
	return s.WalletRepo.UpdateWallet(wallet)
}
