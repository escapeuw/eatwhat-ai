package services

import (
	"encoding/json"
	"fmt"

	"github.com/escapeuw/eatwhat/backend/db"
	"github.com/escapeuw/eatwhat/backend/models"
)

// users food preference
func GetRecentPreferenceData(uuid string) string {
	user := FindOrCreateUserByUUID(uuid)

	var prefs []models.FoodPreference
	db.DB.
		Where("user_id = ?", user.ID).
		Order("created_at desc").
		Limit(10).
		Find(&prefs)

	if len(prefs) == 0 {
		empty := map[string]interface{}{"recent_prefs": []interface{}{}}
		jsonBytes, _ := json.Marshal(empty)
		return string(jsonBytes)
	}

	// Compressed structure
	type prefData struct {
		S   []string `json:"s"`   // Suggested
		Sel string   `json:"sel"` // Selected
	}

	var compact []prefData
	for _, p := range prefs {
		compact = append(compact, prefData{
			S:   p.Suggested,
			Sel: p.Selected,
		})
	}

	result := map[string]interface{}{
		"recent_prefs": compact,
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		fmt.Println("Failed to marshal preference history:", err)
		return "{}"
	}

	return string(jsonBytes)
}

// user's feedbacks
func GetRecentFeedbackData(uuid string) string {
	user := FindOrCreateUserByUUID(uuid)

	var feedbacks []models.Feedback
	db.DB.
		Where("user_id = ?", user.ID).
		Order("created_at desc").
		Limit(10).
		Find(&feedbacks)

	if len(feedbacks) == 0 {
		empty := map[string]interface{}{"recent_feedback": []interface{}{}}
		jsonBytes, _ := json.Marshal(empty)
		return string(jsonBytes)
	}

	// Compressed structure
	type compactFeedback struct {
		M  string `json:"m"`  // Meal name
		G  bool   `json:"g"`  // Was good
		C  string `json:"c"`  // Comment
		Mo string `json:"mo"` // Mood
		T  string `json:"t"`  // Time
		L  string `json:"l"`  // Location
	}

	compact := make([]compactFeedback, 0, len(feedbacks)) // preallocate

	for _, f := range feedbacks {
		compact = append(compact, compactFeedback{
			M:  f.MealName,
			G:  f.WasGood,
			C:  f.Comment,
			Mo: f.Mood,
			T:  f.Time,
			L:  f.Location,
		})
	}

	result := map[string]interface{}{
		"recent_feedback": compact,
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		fmt.Println("Failed to marshal feedback history:", err)
		return "{}"
	}

	return string(jsonBytes)
}
