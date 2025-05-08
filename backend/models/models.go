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
	UserID   uint   `gorm:"index:idx_user_created_at"`
	MealName string
	Comment  string
	WasGood  bool
	Mood     string
	Time     string
	Location string
}

type FoodPreference struct {
	gorm.Model
	UserID    uint     `gorm:"index:idx_user_created_at"`
	Suggested []string `gorm:"serializer:json"`
	Selected  string
}
