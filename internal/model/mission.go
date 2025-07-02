package model

import (
	"time"
)

type Mission struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	Points           int       `json:"points"`
	AssetType        string    `json:"asset_type"` // e.g. NFT, Carbon
	AssetAmount      float64   `json:"asset_amount"`
	VerificationType string    `json:"verification_type"` // e.g. photo, gps, ocr
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
