package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type MissionService struct {
	MissionRepo *repository.MissionRepository
}

func NewMissionService(missionRepo *repository.MissionRepository) *MissionService {
	return &MissionService{MissionRepo: missionRepo}
}

func (s *MissionService) ListMissions() ([]model.Mission, error) {
	return s.MissionRepo.GetAllMissions()
}

func (s *MissionService) GetMission(id uint) (*model.Mission, error) {
	return s.MissionRepo.GetMissionByID(id)
}

func (s *MissionService) CreateMission(mission *model.Mission) error {
	return s.MissionRepo.CreateMission(mission)
}
