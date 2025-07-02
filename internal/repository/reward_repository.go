package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type RewardRepository struct {
	DB *gorm.DB
}

func NewRewardRepository(db *gorm.DB) *RewardRepository {
	return &RewardRepository{DB: db}
}

func (r *RewardRepository) CreateReward(reward *model.Reward) error {
	return r.DB.Create(reward).Error
}

func (r *RewardRepository) GetRewardsByUserID(userID uint) ([]model.Reward, error) {
	var rewards []model.Reward
	err := r.DB.Where("user_id = ?", userID).Find(&rewards).Error
	return rewards, err
}

func (r *RewardRepository) UpdateRewardStatus(rewardID uint, status string) error {
	return r.DB.Model(&model.Reward{}).Where("id = ?", rewardID).Update("status", status).Error
}
