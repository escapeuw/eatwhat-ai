package handlers

import (
	"fmt"
	"net/http"

	"github.com/escapeuw/eatwhat/backend/db"
	"github.com/escapeuw/eatwhat/backend/models"
	"github.com/escapeuw/eatwhat/backend/services"
	"github.com/gin-gonic/gin"
)

type SuggestionInput struct {
	UUID     string `json:"uuid"`
	Mood     string `json:"mood"`
	Time     string `json:"time"`
	Location string `json:"location"`
}

type PreferenceInput struct {
	UUID      string   `json:"uuid"`
	Suggested []string `json:"suggested"` // ✅ now a slice, not a string
	Selected  string   `json:"selected"`  // what user picked
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
	suggestion := services.GenerateMealSuggestion(input.Mood, input.Time, input.Location, input.UUID)

	db.DB.Create(&models.Mood{
		UserID:   user.ID,
		Mood:     input.Mood,
		Time:     input.Time,
		Location: input.Location,
	})
	fmt.Println("Responding with suggesting:", suggestion)
	c.JSON(http.StatusOK, gin.H{"suggestion": suggestion})
}

// after user feedback
func HandlePreference(c *gin.Context) {
	var input PreferenceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := services.FindOrCreateUserByUUID(input.UUID)

	pref := models.FoodPreference{
		UserID:    user.ID,
		Suggested: input.Suggested, // ✅ directly assign slice
		Selected:  input.Selected,
	}

	if err := db.DB.Create(&pref).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save preference"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Preference saved"})
}
