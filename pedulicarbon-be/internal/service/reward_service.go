package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type RewardService struct {
	RewardRepo *repository.RewardRepository
}

func NewRewardService(rewardRepo *repository.RewardRepository) *RewardService {
	return &RewardService{RewardRepo: rewardRepo}
}

func (s *RewardService) CreateReward(reward *model.Reward) error {
	return s.RewardRepo.CreateReward(reward)
}

func (s *RewardService) GetUserRewards(userID uint) ([]model.Reward, error) {
	return s.RewardRepo.GetRewardsByUserID(userID)
}

func (s *RewardService) UpdateRewardStatus(rewardID uint, status string) error {
	return s.RewardRepo.UpdateRewardStatus(rewardID, status)
}
