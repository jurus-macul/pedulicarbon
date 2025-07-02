package api

import (
	"fmt"
	"net/http"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type UserHandler struct {
	UserService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{UserService: userService}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req model.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Selalu isi ii_principal dari env
	req.IIPrincipal = viper.GetString("ICP_PRINCIPAL_ID")
	fmt.Printf("[DEBUG] Register user: name=%s, email=%s, principal=%s\n", req.Name, req.Email, req.IIPrincipal)
	if req.IIPrincipal == "" {
		fmt.Println("[ERROR] ICP_PRINCIPAL_ID di env kosong!")
		c.JSON(http.StatusBadRequest, gin.H{"error": "ii_principal (ICP principal) wajib diisi di env (ICP_PRINCIPAL_ID)"})
		return
	}
	if err := h.UserService.RegisterUser(&req); err != nil {
		fmt.Printf("[ERROR] Register user gagal: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("[DEBUG] Register user sukses: id=%d\n", req.ID)
	c.JSON(http.StatusCreated, req)
}

func (h *UserHandler) Login(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := h.UserService.LoginUser(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.Param("id")
	// Konversi userID ke uint
	var id uint
	_, err := fmt.Sscanf(userID, "%d", &id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id (profile)"})
		return
	}
	user, err := h.UserService.GetProfile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
