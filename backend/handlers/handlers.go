package handlers

import (
  "fmt"
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
  fmt.Println("Received /api/suggest request")

  var input SuggestionInput
  if err := c.ShouldBindJSON(&input); err != nil {
    fmt.Println("JSON Bind Error:", err)

    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  fmt.Printf("Input received: %+v\n", input)

  user := services.FindOrCreateUserByUUID(input.UUID)
  suggestion := services.GenerateMealSuggestion(input.Mood, input.Time, input.Location)

  db.DB.Create(&models.Mood{
    UserID:   user.ID,
    Mood:     input.Mood,
    Time:     input.Time,
    Location: input.Location,
  })
  fmt.Println("Responding with suggesting:", suggestion)
  c.JSON(http.StatusOK, gin.H{"suggestion": suggestion})
}
