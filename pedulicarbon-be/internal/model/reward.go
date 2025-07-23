package model

import (
	"time"
)

type Reward struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `json:"user_id"`
	MissionID   uint      `json:"mission_id"`
	Points      int       `json:"points"`
	AssetType   string    `json:"asset_type"`
	AssetAmount float64   `json:"asset_amount"`
	Status      string    `json:"status"` // e.g. pending, verified, distributed
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
