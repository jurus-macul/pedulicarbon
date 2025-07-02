package model

import (
	"time"
)

type MissionTaken struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `json:"user_id"`
	MissionID  uint      `json:"mission_id"`
	Status     string    `json:"status"` // taken, pending, verified, rejected
	ProofURL   string    `json:"proof_url"`
	GPS        string    `json:"gps"`
	VerifiedAt time.Time `json:"verified_at"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
