package models

import "gorm.io/gorm"

type User struct {
  gorm.Model
  UUID      string `gorm:"uniqueIndex"`
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
  Suggestion string
  WasGood    bool
}
