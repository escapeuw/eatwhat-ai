package handlers

import (
	"bytes"             // ✅ for bytes.NewBuffer
	"io"                // ✅ for io.ReadAll and io.NopCloser
	"encoding/json"
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

	// ✅ Log raw body for debug
    body, _ := io.ReadAll(c.Request.Body)
    fmt.Println("Raw body:", string(body))

    // ✅ Reset body before binding
    c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

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

	type MealResponse struct {
		Reason      string `json:"reason"`
		Suggestions []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
		} `json:"suggestions"`
	}
	
	var parsed MealResponse
	if err := json.Unmarshal([]byte(suggestion), &parsed); err != nil {
		log.Println("Failed to parse GPT response:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid AI response format"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
	"reason":      parsed.Reason,
	"suggestions": parsed.Suggestions,
})


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
