package service

import (
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/repository"
)

type MissionTakenService struct {
	MissionTakenRepo *repository.MissionTakenRepository
}

func NewMissionTakenService(repo *repository.MissionTakenRepository) *MissionTakenService {
	return &MissionTakenService{MissionTakenRepo: repo}
}

func (s *MissionTakenService) TakeMission(mt *model.MissionTaken) error {
	return s.MissionTakenRepo.TakeMission(mt)
}

func (s *MissionTakenService) GetUserMissions(userID uint) ([]model.MissionTaken, error) {
	return s.MissionTakenRepo.GetUserMissions(userID)
}

func (s *MissionTakenService) UpdateProof(mtID uint, proofURL, gps string) error {
	return s.MissionTakenRepo.UpdateProof(mtID, proofURL, gps)
}

func (s *MissionTakenService) VerifyMission(mtID uint) error {
	return s.MissionTakenRepo.VerifyMission(mtID)
}
