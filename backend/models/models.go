package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UUID       string    `gorm:"uniqueIndex"`
	LastActive time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Moods      []Mood
	Feedbacks  []Feedback
}

type Mood struct {
	gorm.Model
	UserID   uint
	Mood     string
	Time     string
	Location string
}

type Feedback struct {
	gorm.Model
	UserID   uint
	MealName string
	Comment  string
	WasGood  bool
	Mood     string
	Time     string
	Location string
}

// for user's strict preference on food
type FoodPreference struct {
	gorm.Model
	UserID    uint
	Suggested []string `gorm:"serializer:json"`
	Selected  string
}
