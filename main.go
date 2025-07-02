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
	godotenv.Load(".env")
	fmt.Println("[DEBUG] ENV ICP_PRINCIPAL_ID:", os.Getenv("ICP_PRINCIPAL_ID"))
	fmt.Println("[DEBUG] ENV ICP_CANISTER_HOST:", os.Getenv("ICP_CANISTER_HOST"))
	fmt.Println("[DEBUG] ENV ICP_CANISTER_ID:", os.Getenv("ICP_CANISTER_ID"))

	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " password=" + os.Getenv("DB_PASSWORD") + " dbname=" + os.Getenv("DB_NAME") + " port=" + os.Getenv("DB_PORT") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	db.AutoMigrate(&model.User{}, &model.Mission{}, &model.Reward{}, &model.Wallet{}, &model.MissionTaken{}, &model.RewardCatalog{}, &model.Withdraw{}, &model.UserNFT{})

	r := api.InitRouter(db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
