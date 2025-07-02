package model

import (
	"time"
)

type Wallet struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	CarbonNFT float64   `json:"carbon_nft"`
	Points    int       `json:"points"`
	Rupiah    float64   `json:"rupiah"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
