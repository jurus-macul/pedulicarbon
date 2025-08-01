package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type UserNFTRepository struct {
	DB *gorm.DB
}

func NewUserNFTRepository(db *gorm.DB) *UserNFTRepository {
	return &UserNFTRepository{DB: db}
}

func (r *UserNFTRepository) CreateUserNFT(userNFT *model.UserNFT) error {
	return r.DB.Create(userNFT).Error
}

func (r *UserNFTRepository) GetNFTsByUserID(userID uint) ([]model.UserNFT, error) {
	var nfts []model.UserNFT
	err := r.DB.Where("user_id = ?", userID).Find(&nfts).Error
	return nfts, err
}

func (r *UserNFTRepository) UpdateUserNFT(userNFT *model.UserNFT) error {
	return r.DB.Save(userNFT).Error
}

func (r *UserNFTRepository) GetUserNFTByNFTID(nftID string) (*model.UserNFT, error) {
	var userNFT model.UserNFT
	err := r.DB.Where("nft_id = ?", nftID).First(&userNFT).Error
	return &userNFT, err
}
