package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *model.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.DB.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) GetUserByIIPrincipal(ii string) (*model.User, error) {
	var user model.User
	err := r.DB.Where("ii_principal = ?", ii).First(&user).Error
	return &user, err
}

func (r *UserRepository) UpdateUserPoints(userID uint, points int) error {
	return r.DB.Model(&model.User{}).Where("id = ?", userID).Update("points", points).Error
}

func (r *UserRepository) GetUserByID(userID uint) (*model.User, error) {
	var user model.User
	err := r.DB.First(&user, userID).Error
	return &user, err
}
