package model

import (
	"time"
)

type Withdraw struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Amount    float64   `json:"amount"`
	Status    string    `json:"status"` // pending, success, failed
	Target    string    `json:"target"` // e-wallet/bank
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
