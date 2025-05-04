package main

import (
	"time"

	"github.com/escapeuw/eatwhat/backend/db"
	"github.com/escapeuw/eatwhat/backend/handlers"
	"github.com/escapeuw/eatwhat/backend/models"
	"github.com/gin-contrib/cors"
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

	// ✅ Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://dhwang.dev/eatwhat-ai"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/api/suggest", handlers.HandleSuggest)
	r.POST("/api/preference", handlers.HandlePreference)

	r.Run() // Runs on :8080 by default
}
