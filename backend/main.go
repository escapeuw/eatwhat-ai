package main

import (
	"github.com/gin-gonic/gin"
	"github.com/escapeuw/eatwhat/backend/db"
  	"github.com/escapeuw/eatwhat/backend/models"
  	"github.com/escapeuw/eatwhat/backend/handlers"
  )

  func main() {
	db.ConnectDB()
	db.DB.AutoMigrate(&models.User{}, &models.Mood{}, &models.Feedback{})
  
	r := gin.Default()
	r.POST("/api/suggest", handlers.HandleSuggest)
  
	r.Run() // Runs on :8080 by default
  }