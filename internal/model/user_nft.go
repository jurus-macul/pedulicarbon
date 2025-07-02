package model

import "time"

type UserNFT struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	UserID         uint       `json:"user_id"`
	NFTID          string     `json:"nft_id"`
	Status         string     `json:"status"`     // owned, claimed
	ClaimedBy      *uint      `json:"claimed_by"` // user/institusi yang claim
	ClaimedAt      *time.Time `json:"claimed_at"`
	CertificateURL string     `json:"certificate_url"`
	CreatedAt      time.Time  `json:"created_at"`
}
