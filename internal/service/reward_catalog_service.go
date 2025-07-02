package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type RewardCatalogService struct {
	CatalogRepo *repository.RewardCatalogRepository
}

func NewRewardCatalogService(repo *repository.RewardCatalogRepository) *RewardCatalogService {
	return &RewardCatalogService{CatalogRepo: repo}
}

func (s *RewardCatalogService) ListCatalog() ([]model.RewardCatalog, error) {
	return s.CatalogRepo.ListCatalog()
}

func (s *RewardCatalogService) GetCatalog(id uint) (*model.RewardCatalog, error) {
	return s.CatalogRepo.GetCatalogByID(id)
}

func (s *RewardCatalogService) RedeemCatalog(id uint) error {
	return s.CatalogRepo.RedeemCatalog(id)
}
