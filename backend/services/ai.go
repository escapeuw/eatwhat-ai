package services

import (
  "context"
  "fmt"
  openai "github.com/sashabaranov/go-openai"
  "os"
)

func GenerateMealSuggestion(mood, time, location string) string {
	fmt.Println("OPENAI_API_KEY:", os.Getenv("OPENAI_API_KEY"))

  	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
  	prompt := fmt.Sprintf(`I want a meal recommendation.

Here is the context:
- Mood: %s
- Time: %s
- Location: %s

Give me one meal idea that fits this situation and explain briefly.`, mood, time, location)

  resp, err := client.CreateChatCompletion(
    context.Background(),
    openai.ChatCompletionRequest{
      Model: openai.GPT3Dot5Turbo,
      Messages: []openai.ChatCompletionMessage{
        {Role: "user", Content: prompt},
      },
    },
  )

  if err != nil || len(resp.Choices) == 0 {
    return "How about a warm bowl of ramen?"
  }

  return resp.Choices[0].Message.Content
}
