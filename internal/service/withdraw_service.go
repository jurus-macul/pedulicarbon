package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type WithdrawService struct {
	WithdrawRepo *repository.WithdrawRepository
}

func NewWithdrawService(repo *repository.WithdrawRepository) *WithdrawService {
	return &WithdrawService{WithdrawRepo: repo}
}

func (s *WithdrawService) CreateWithdraw(wd *model.Withdraw) error {
	return s.WithdrawRepo.CreateWithdraw(wd)
}

func (s *WithdrawService) GetUserWithdraws(userID uint) ([]model.Withdraw, error) {
	return s.WithdrawRepo.GetUserWithdraws(userID)
}

func (s *WithdrawService) UpdateWithdrawStatus(id uint, status string) error {
	return s.WithdrawRepo.UpdateWithdrawStatus(id, status)
}
