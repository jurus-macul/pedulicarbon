package model

import (
	"time"
)

type RewardCatalog struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	PointsRequired int       `json:"points_required"`
	Stock          int       `json:"stock"`
	Type           string    `json:"type"` // voucher, product
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
