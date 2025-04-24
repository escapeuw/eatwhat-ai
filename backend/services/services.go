package services

import (
  "github.com/escapeuw/eatwhat/backend/db"
  "github.com/escapeuw/eatwhat/backend/models"
)

func FindOrCreateUserByUUID(uuid string) models.User {
  var user models.User
  result := db.DB.Where("uuid = ?", uuid).First(&user)
  if result.Error != nil || user.ID == 0 {
    user = models.User{UUID: uuid}
    db.DB.Create(&user)
  }
  return user
}
