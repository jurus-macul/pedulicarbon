package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type WalletRepository struct {
	DB *gorm.DB
}

func NewWalletRepository(db *gorm.DB) *WalletRepository {
	return &WalletRepository{DB: db}
}

func (r *WalletRepository) GetWalletByUserID(userID uint) (*model.Wallet, error) {
	var wallet model.Wallet
	err := r.DB.Where("user_id = ?", userID).First(&wallet).Error
	return &wallet, err
}

func (r *WalletRepository) CreateWallet(wallet *model.Wallet) error {
	return r.DB.Create(wallet).Error
}

func (r *WalletRepository) UpdateWallet(wallet *model.Wallet) error {
	return r.DB.Save(wallet).Error
}
