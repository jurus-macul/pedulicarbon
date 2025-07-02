package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type UserService struct {
	UserRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{UserRepo: userRepo}
}

func (s *UserService) RegisterUser(user *model.User) error {
	return s.UserRepo.CreateUser(user)
}

func (s *UserService) LoginUser(email string) (*model.User, error) {
	return s.UserRepo.GetUserByEmail(email)
}

func (s *UserService) GetProfile(userID uint) (*model.User, error) {
	// Implementasi bisa diperluas
	return s.UserRepo.GetUserByID(userID)
}

func (s *UserService) AddPoints(userID uint, points int) error {
	return s.UserRepo.UpdateUserPoints(userID, points)
}
