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
	c.JSON(http.StatusOK, missions)
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
	c.JSON(http.StatusOK, mission)
}

func (h *MissionHandler) CreateMission(c *gin.Context) {
	var req model.Mission
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Title == "" || req.Description == "" || req.AssetType == "" || req.AssetAmount <= 0 || req.VerificationType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Field title, description, asset_type, asset_amount (>0), verification_type wajib diisi"})
		return
	}
	if err := h.MissionService.CreateMission(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}
