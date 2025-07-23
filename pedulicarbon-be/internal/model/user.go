package model

import (
	"time"
)

type User struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `json:"name" gorm:"not null"`
	Email       string    `json:"email" gorm:"unique;not null"`
	IIPrincipal string    `json:"ii_principal" gorm:"not null"`
	Points      int       `json:"points" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
