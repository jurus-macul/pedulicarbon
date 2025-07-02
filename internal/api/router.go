package api

import (
	"pedulicarbon/internal/motoko"
	"pedulicarbon/internal/repository"
	"pedulicarbon/internal/service"

	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitRouter(db *gorm.DB) *gin.Engine {
	// Repository
	userRepo := repository.NewUserRepository(db)
	missionRepo := repository.NewMissionRepository(db)
	rewardRepo := repository.NewRewardRepository(db)
	walletRepo := repository.NewWalletRepository(db)
	missionTakenRepo := repository.NewMissionTakenRepository(db)
	rewardCatalogRepo := repository.NewRewardCatalogRepository(db)
	withdrawRepo := repository.NewWithdrawRepository(db)
	userNFTRepo := repository.NewUserNFTRepository(db)

	// Service
	userService := service.NewUserService(userRepo)
	missionService := service.NewMissionService(missionRepo)
	rewardService := service.NewRewardService(rewardRepo)
	walletService := service.NewWalletService(walletRepo)
	canisterHost := os.Getenv("ICP_CANISTER_HOST")
	canisterID := os.Getenv("ICP_CANISTER_ID")
	motokoClient := motoko.NewMotokoClient(canisterHost, canisterID)
	missionTakenService := service.NewMissionTakenService(missionTakenRepo, userRepo, missionRepo, motokoClient, userNFTRepo)
	rewardCatalogService := service.NewRewardCatalogService(rewardCatalogRepo)
	withdrawService := service.NewWithdrawService(withdrawRepo)

	// Handler
	userHandler := NewUserHandler(userService)
	missionHandler := NewMissionHandler(missionService)
	rewardHandler := NewRewardHandler(rewardService)
	walletHandler := NewWalletHandler(walletService)
	missionTakenHandler := NewMissionTakenHandler(missionTakenService)
	rewardCatalogHandler := NewRewardCatalogHandler(rewardCatalogService)
	withdrawHandler := NewWithdrawHandler(withdrawService)

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// User
	r.POST("/auth/register", userHandler.Register)
	r.POST("/auth/login", userHandler.Login)
	r.GET("/users/profile/:id", userHandler.GetProfile)

	// Mission
	r.GET("/missions", missionHandler.ListMissions)
	r.GET("/missions/:id", missionHandler.GetMission)
	r.POST("/missions", missionHandler.CreateMission)

	// Mission Taken
	r.POST("/missions/:id/take", missionTakenHandler.TakeMission)
	r.GET("/users/:user_id/missions", missionTakenHandler.GetUserMissions)
	r.POST("/missions-taken/:id/proof", missionTakenHandler.SubmitProof)
	r.POST("/missions-taken/:id/verify", missionTakenHandler.VerifyMission)
	r.GET("/users/:user_id/nfts", missionTakenHandler.GetUserNFTs)

	// Reward
	r.POST("/rewards", rewardHandler.CreateReward)
	r.GET("/rewards/user/:user_id", rewardHandler.GetUserRewards)
	r.PUT("/rewards/:id/status", rewardHandler.UpdateRewardStatus)

	// Reward Catalog
	r.GET("/rewards/catalog", rewardCatalogHandler.ListCatalog)
	r.GET("/rewards/catalog/:id", rewardCatalogHandler.GetCatalog)
	r.POST("/rewards/catalog/:id/redeem", rewardCatalogHandler.RedeemCatalog)

	// Wallet
	r.GET("/wallets/user/:user_id", walletHandler.GetWallet)
	r.POST("/wallets", walletHandler.CreateWallet)
	r.PUT("/wallets", walletHandler.UpdateWallet)

	// Withdraw
	r.POST("/wallets/withdraw", withdrawHandler.CreateWithdraw)
	r.GET("/wallets/withdraw/user/:user_id", withdrawHandler.GetUserWithdraws)
	r.PUT("/wallets/withdraw/:id/status", withdrawHandler.UpdateWithdrawStatus)

	return r
}
