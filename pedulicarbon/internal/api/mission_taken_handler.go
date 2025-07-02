package api

import (
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MissionTakenHandler struct {
	MissionTakenService *service.MissionTakenService
}

func NewMissionTakenHandler(s *service.MissionTakenService) *MissionTakenHandler {
	return &MissionTakenHandler{MissionTakenService: s}
}

func (h *MissionTakenHandler) TakeMission(c *gin.Context) {
	var req model.MissionTaken
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.MissionTakenService.TakeMission(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}

func (h *MissionTakenHandler) GetUserMissions(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	missions, err := h.MissionTakenService.GetUserMissions(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, missions)
}

func (h *MissionTakenHandler) SubmitProof(c *gin.Context) {
	mtIDStr := c.Param("id")
	mtID, err := strconv.ParseUint(mtIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid mission taken id"})
		return
	}
	var req struct {
		ProofURL string `json:"proof_url"`
		GPS      string `json:"gps"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.MissionTakenService.UpdateProof(uint(mtID), req.ProofURL, req.GPS); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "proof submitted"})
}

func (h *MissionTakenHandler) VerifyMission(c *gin.Context) {
	mtIDStr := c.Param("id")
	mtID, err := strconv.ParseUint(mtIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid mission taken id"})
		return
	}
	if err := h.MissionTakenService.VerifyMission(uint(mtID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "mission verified"})
}
