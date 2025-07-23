package api

import (
	"fmt"
	"net/http"
	"os"
	"pedulicarbon/internal/model"
	"pedulicarbon/internal/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{UserService: userService}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Buat user model
	user := model.User{
		Name:        req.Name,
		Email:       req.Email,
		IIPrincipal: os.Getenv("ICP_PRINCIPAL_ID"),
		Points:      0,
	}

	fmt.Printf("[DEBUG] Register user: name=%s, email=%s, principal=%s\n", user.Name, user.Email, user.IIPrincipal)

	if user.IIPrincipal == "" {
		fmt.Println("[ERROR] ICP_PRINCIPAL_ID di env kosong!")
		c.JSON(http.StatusBadRequest, gin.H{"error": "ICP_PRINCIPAL_ID environment variable is required"})
		return
	}

	if err := h.UserService.RegisterUser(&user); err != nil {
		fmt.Printf("[ERROR] Register user gagal: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("[DEBUG] Register user sukses: id=%d\n", user.ID)
	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user":    user,
	})
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
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
	})
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.Param("id")
	// Konversi userID ke uint
	var id uint
	_, err := fmt.Sscanf(userID, "%d", &id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	user, err := h.UserService.GetProfile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
