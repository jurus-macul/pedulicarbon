package model

import (
	"time"
)

type User struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `json:"name"`
	Email       string    `gorm:"unique" json:"email"`
	IIPrincipal string    `gorm:"unique" json:"ii_principal"`
	Points      int       `json:"points"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
