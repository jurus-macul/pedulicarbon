package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type WithdrawRepository struct {
	DB *gorm.DB
}

func NewWithdrawRepository(db *gorm.DB) *WithdrawRepository {
	return &WithdrawRepository{DB: db}
}

func (r *WithdrawRepository) CreateWithdraw(wd *model.Withdraw) error {
	return r.DB.Create(wd).Error
}

func (r *WithdrawRepository) GetUserWithdraws(userID uint) ([]model.Withdraw, error) {
	var withdraws []model.Withdraw
	err := r.DB.Where("user_id = ?", userID).Find(&withdraws).Error
	return withdraws, err
}

func (r *WithdrawRepository) UpdateWithdrawStatus(id uint, status string) error {
	return r.DB.Model(&model.Withdraw{}).Where("id = ?", id).Update("status", status).Error
}
