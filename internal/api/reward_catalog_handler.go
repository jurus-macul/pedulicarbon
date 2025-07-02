package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RewardCatalogHandler struct {
	CatalogService *service.RewardCatalogService
	UserService    *service.UserService
	RewardService  *service.RewardService
}

func NewRewardCatalogHandler(catalogService *service.RewardCatalogService, userService *service.UserService, rewardService *service.RewardService) *RewardCatalogHandler {
	return &RewardCatalogHandler{
		CatalogService: catalogService,
		UserService:    userService,
		RewardService:  rewardService,
	}
}

func (h *RewardCatalogHandler) ListCatalog(c *gin.Context) {
	catalog, err := h.CatalogService.ListCatalog()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, catalog)
}

func (h *RewardCatalogHandler) GetCatalog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid catalog id"})
		return
	}
	item, err := h.CatalogService.GetCatalog(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "catalog not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *RewardCatalogHandler) RedeemCatalog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid catalog id"})
		return
	}
	var req struct {
		UserID uint `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := h.UserService.GetProfile(req.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	catalog, err := h.CatalogService.GetCatalog(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "catalog not found"})
		return
	}
	if user.Points < catalog.PointsRequired {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not enough points"})
		return
	}
	// Kurangi point user
	if err := h.UserService.AddPoints(user.ID, -catalog.PointsRequired); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Kurangi stok reward
	if err := h.CatalogService.RedeemCatalog(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Catat reward ke tabel Reward
	reward := &model.Reward{
		UserID:      user.ID,
		Points:      catalog.PointsRequired,
		AssetType:   catalog.Type,
		AssetAmount: 0, // bisa diisi sesuai kebutuhan
		Status:      "redeemed",
	}
	if err := h.RewardService.CreateReward(reward); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "redeemed"})
}
