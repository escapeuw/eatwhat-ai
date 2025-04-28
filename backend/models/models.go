package models

import (
  "gorm.io/gorm"
  "time"
)

type User struct {
  gorm.Model
  UUID      string `gorm:"uniqueIndex"`
  LastActive time.Time `gorm:"default:CURRENT_TIMESTAMP"`
  Moods     []Mood
  Feedbacks []Feedback
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
  UserID     uint
  MealName string
  Comment string
  WasGood    bool
}

