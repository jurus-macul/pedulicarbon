package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RewardHandler struct {
	RewardService *service.RewardService
}

func NewRewardHandler(rewardService *service.RewardService) *RewardHandler {
	return &RewardHandler{RewardService: rewardService}
}

func (h *RewardHandler) CreateReward(c *gin.Context) {
	var req model.Reward
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.RewardService.CreateReward(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}

func (h *RewardHandler) GetUserRewards(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	rewards, err := h.RewardService.GetUserRewards(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rewards)
}

func (h *RewardHandler) UpdateRewardStatus(c *gin.Context) {
	rewardIDStr := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	rewardID, err := strconv.ParseUint(rewardIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid reward id"})
		return
	}
	if err := h.RewardService.UpdateRewardStatus(uint(rewardID), req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}
