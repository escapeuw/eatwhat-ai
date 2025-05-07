package services

import (
	"errors"

	"github.com/escapeuw/eatwhat/backend/db"
	"github.com/escapeuw/eatwhat/backend/models"
	"gorm.io/gorm"
)

func FindOrCreateUserByUUID(uuid string) models.User {
	if uuid == "" {
		panic("UUID is required but missing in FindOrCreateUserByUUID")
	}

	var user models.User
	err := db.DB.Where("uuid = ?", uuid).First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		user = models.User{UUID: uuid}
		if err := db.DB.Create(&user).Error; err != nil {
			panic("Failed to create new user: " + err.Error())
		}
	} else if err != nil {
		// Some other DB error
		panic("DB error in FindOrCreateUserByUUID: " + err.Error())
	}

	return user
}