package model

import "time"

type UserNFT struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	NFTID     string    `json:"nft_id"`
	CreatedAt time.Time `json:"created_at"`
}
