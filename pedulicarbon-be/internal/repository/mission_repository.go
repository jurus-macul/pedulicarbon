package repository

import (
	"pedulicarbon/internal/model"

	"gorm.io/gorm"
)

type MissionRepository struct {
	DB *gorm.DB
}

func NewMissionRepository(db *gorm.DB) *MissionRepository {
	return &MissionRepository{DB: db}
}

func (r *MissionRepository) GetAllMissions() ([]model.Mission, error) {
	var missions []model.Mission
	err := r.DB.Find(&missions).Error
	return missions, err
}

func (r *MissionRepository) GetMissionByID(id uint) (*model.Mission, error) {
	var mission model.Mission
	err := r.DB.First(&mission, id).Error
	return &mission, err
}

func (r *MissionRepository) CreateMission(mission *model.Mission) error {
	return r.DB.Create(mission).Error
}
