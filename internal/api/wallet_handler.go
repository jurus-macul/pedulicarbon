package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WalletHandler struct {
	WalletService *service.WalletService
}

func NewWalletHandler(walletService *service.WalletService) *WalletHandler {
	return &WalletHandler{WalletService: walletService}
}

func (h *WalletHandler) GetWallet(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	wallet, err := h.WalletService.GetWallet(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "wallet not found"})
		return
	}
	c.JSON(http.StatusOK, wallet)
}

func (h *WalletHandler) CreateWallet(c *gin.Context) {
	var req model.Wallet
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.WalletService.CreateWallet(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}

func (h *WalletHandler) UpdateWallet(c *gin.Context) {
	var req model.Wallet
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.WalletService.UpdateWallet(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, req)
}
