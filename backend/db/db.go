package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"github.com/joho/godotenv"
)

var DB *gorm.DB

func ConnectDB() {
  _ = godotenv.Load()
  fmt.Println("Loaded DB_URL:", os.Getenv("DB_URL"))

  dsn := os.Getenv("DB_URL")
  database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
  if err != nil {
    log.Fatal("Failed to connect to DB:", err)
  }
  DB = database
  log.Println("Connected to DB")
}
