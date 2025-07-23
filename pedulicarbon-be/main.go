package main

import (
	"fmt"
	"log"
	"os"
	"pedulicarbon/internal/api"
	"pedulicarbon/internal/model"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load env
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("[WARNING] .env file not found: %v", err)
	}

	// Debug environment variables
	fmt.Println("=== ENVIRONMENT VARIABLES ===")
	fmt.Printf("ICP_PRINCIPAL_ID: %s\n", os.Getenv("ICP_PRINCIPAL_ID"))
	fmt.Printf("ICP_CANISTER_HOST: %s\n", os.Getenv("ICP_CANISTER_HOST"))
	fmt.Printf("ICP_CANISTER_ID: %s\n", os.Getenv("ICP_CANISTER_ID"))
	fmt.Printf("DB_HOST: %s\n", os.Getenv("DB_HOST"))
	fmt.Printf("DB_USER: %s\n", os.Getenv("DB_USER"))
	fmt.Printf("DB_NAME: %s\n", os.Getenv("DB_NAME"))
	fmt.Printf("DB_PORT: %s\n", os.Getenv("DB_PORT"))
	fmt.Println("=============================")

	// Database connection
	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " password=" + os.Getenv("DB_PASSWORD") + " dbname=" + os.Getenv("DB_NAME") + " port=" + os.Getenv("DB_PORT") + " sslmode=disable"

	fmt.Printf("[DEBUG] Connecting to database: %s\n", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}
	fmt.Println("[SUCCESS] Database connected successfully")

	// Auto migrate
	fmt.Println("[DEBUG] Running database migrations...")
	err = db.AutoMigrate(&model.User{}, &model.Mission{}, &model.Reward{}, &model.Wallet{}, &model.MissionTaken{}, &model.RewardCatalog{}, &model.Withdraw{}, &model.UserNFT{})
	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}
	fmt.Println("[SUCCESS] Database migrations completed")

	// Initialize router
	r := api.InitRouter(db)

	// Get port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("[INFO] Starting server on port %s\n", port)
	fmt.Println("[INFO] Health check available at: http://localhost:" + port + "/health")

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
