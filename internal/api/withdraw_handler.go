package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WithdrawHandler struct {
	WithdrawService *service.WithdrawService
}

func NewWithdrawHandler(s *service.WithdrawService) *WithdrawHandler {
	return &WithdrawHandler{WithdrawService: s}
}

func (h *WithdrawHandler) CreateWithdraw(c *gin.Context) {
	var req model.Withdraw
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.WithdrawService.CreateWithdraw(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}

func (h *WithdrawHandler) GetUserWithdraws(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	withdraws, err := h.WithdrawService.GetUserWithdraws(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, withdraws)
}

func (h *WithdrawHandler) UpdateWithdrawStatus(c *gin.Context) {
	idStr := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid withdraw id"})
		return
	}
	if err := h.WithdrawService.UpdateWithdrawStatus(uint(id), req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}
