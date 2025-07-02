package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MissionHandler struct {
	MissionService *service.MissionService
}

func NewMissionHandler(missionService *service.MissionService) *MissionHandler {
	return &MissionHandler{MissionService: missionService}
}

func (h *MissionHandler) ListMissions(c *gin.Context) {
	missions, err := h.MissionService.ListMissions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"missions": missions,
	})
}

func (h *MissionHandler) GetMission(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid mission id"})
		return
	}
	mission, err := h.MissionService.GetMission(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "mission not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"mission": mission,
	})
}

func (h *MissionHandler) CreateMission(c *gin.Context) {
	var req struct {
		Title            string  `json:"title" binding:"required"`
		Description      string  `json:"description" binding:"required"`
		AssetType        string  `json:"asset_type"`
		AssetAmount      float64 `json:"asset_amount"`
		VerificationType string  `json:"verification_type"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set default values if not provided
	if req.AssetType == "" {
		req.AssetType = "Carbon"
	}
	if req.AssetAmount <= 0 {
		req.AssetAmount = 10.0 // Default carbon offset
	}
	if req.VerificationType == "" {
		req.VerificationType = "photo"
	}

	mission := model.Mission{
		Title:            req.Title,
		Description:      req.Description,
		AssetType:        req.AssetType,
		AssetAmount:      req.AssetAmount,
		VerificationType: req.VerificationType,
		Points:           0, // Will be calculated based on asset_amount
	}

	if err := h.MissionService.CreateMission(&mission); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Mission created successfully",
		"mission": mission,
	})
}
