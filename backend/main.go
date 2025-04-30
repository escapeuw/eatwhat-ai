package main

import (
	"github.com/escapeuw/eatwhat/backend/db"
	"github.com/escapeuw/eatwhat/backend/handlers"
	"github.com/escapeuw/eatwhat/backend/models"
	"github.com/gin-gonic/gin"
)

func main() {
	db.ConnectDB()
	db.DB.AutoMigrate(
		&models.User{},
		&models.Mood{},
		&models.Feedback{},
		&models.FoodPreference{},
	)

	r := gin.Default()
	r.POST("/api/suggest", handlers.HandleSuggest)
	r.POST("/api/preference", handlers.HandlePreference)

	r.Run() // Runs on :8080 by default
}
