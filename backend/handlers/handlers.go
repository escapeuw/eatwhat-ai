package handlers

import (
  "github.com/gin-gonic/gin"
  "github.com/escapeuw/eatwhat/backend/db"
  "github.com/escapeuw/eatwhat/backend/models"
  "github.com/escapeuw/eatwhat/backend/services"
  "net/http"
)

type SuggestionInput struct {
  UUID     string `json:"uuid"`
  Mood     string `json:"mood"`
  Time     string `json:"time"`
  Location string `json:"location"`
}

func HandleSuggest(c *gin.Context) {
  var input SuggestionInput
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  user := services.FindOrCreateUserByUUID(input.UUID)
  suggestion := services.GenerateMealSuggestion(input.Mood, input.Time, input.Location)

  db.DB.Create(&models.Mood{
    UserID:   user.ID,
    Mood:     input.Mood,
    Time:     input.Time,
    Location: input.Location,
  })

  c.JSON(http.StatusOK, gin.H{"suggestion": suggestion})
}
