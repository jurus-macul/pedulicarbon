package main

import (
	"log"
	"pedulicarbon/internal/api"
	"pedulicarbon/internal/model"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load env
	viper.SetConfigFile(".env")
	_ = viper.ReadInConfig()

	dsn := "host=" + viper.GetString("DB_HOST") + " user=" + viper.GetString("DB_USER") + " password=" + viper.GetString("DB_PASSWORD") + " dbname=" + viper.GetString("DB_NAME") + " port=" + viper.GetString("DB_PORT") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	db.AutoMigrate(&model.User{}, &model.Mission{}, &model.Reward{}, &model.Wallet{}, &model.MissionTaken{}, &model.RewardCatalog{}, &model.Withdraw{}, &model.UserNFT{})

	r := api.InitRouter(db)

	port := viper.GetString("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
