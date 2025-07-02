package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type RewardCatalogRepository struct {
	DB *gorm.DB
}

func NewRewardCatalogRepository(db *gorm.DB) *RewardCatalogRepository {
	return &RewardCatalogRepository{DB: db}
}

func (r *RewardCatalogRepository) ListCatalog() ([]model.RewardCatalog, error) {
	var catalog []model.RewardCatalog
	err := r.DB.Find(&catalog).Error
	return catalog, err
}

func (r *RewardCatalogRepository) GetCatalogByID(id uint) (*model.RewardCatalog, error) {
	var item model.RewardCatalog
	err := r.DB.First(&item, id).Error
	return &item, err
}

func (r *RewardCatalogRepository) RedeemCatalog(id uint) error {
	return r.DB.Model(&model.RewardCatalog{}).Where("id = ? AND stock > 0", id).UpdateColumn("stock", gorm.Expr("stock - 1")).Error
}
