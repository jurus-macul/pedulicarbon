package repository

import (
	"pedulicarbon/internal/model"
	"time"

	"gorm.io/gorm"
)

type MissionTakenRepository struct {
	DB *gorm.DB
}

func NewMissionTakenRepository(db *gorm.DB) *MissionTakenRepository {
	return &MissionTakenRepository{DB: db}
}

func (r *MissionTakenRepository) TakeMission(mt *model.MissionTaken) error {
	return r.DB.Create(mt).Error
}

func (r *MissionTakenRepository) GetUserMissions(userID uint) ([]model.MissionTaken, error) {
	var missions []model.MissionTaken
	err := r.DB.Where("user_id = ?", userID).Find(&missions).Error
	return missions, err
}

func (r *MissionTakenRepository) UpdateProof(mtID uint, proofURL, gps string) error {
	return r.DB.Model(&model.MissionTaken{}).Where("id = ?", mtID).Updates(map[string]interface{}{"proof_url": proofURL, "gps": gps, "status": "pending"}).Error
}

func (r *MissionTakenRepository) VerifyMission(mtID uint) error {
	return r.DB.Model(&model.MissionTaken{}).Where("id = ?", mtID).Updates(map[string]interface{}{"status": "verified", "verified_at": time.Now()}).Error
}
