package api

import (
	"net/http"
	"pedulicarbon/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RewardCatalogHandler struct {
	CatalogService *service.RewardCatalogService
}

func NewRewardCatalogHandler(s *service.RewardCatalogService) *RewardCatalogHandler {
	return &RewardCatalogHandler{CatalogService: s}
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
	if err := h.CatalogService.RedeemCatalog(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "redeemed"})
}
