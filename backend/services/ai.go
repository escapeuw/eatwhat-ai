package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

func GenerateMealSuggestion(mood, time, location, uuid string) string {
	fmt.Println("OPENAI_API_KEY:", os.Getenv("OPENAI_API_KEY"))

	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	userMessage := openai.ChatCompletionMessage{
		Role: "user",
		Content: fmt.Sprintf(
			`I want a personalized meal recommendation. Give me the top 3 meals as a JSON array of objects.
			
			Each object should have:
			- "name": the name of the meal
			- "description": a short sentence explaining it

			Here is my context:
			- Mood: %s
			- Time: %s
			- Location: %s

			For better suggestion, check recent food feedback or preferences using availabe tools`,
			mood, time, location),
	}

	// Register tools
	tools := []openai.Tool{
		{
			Type: openai.ToolTypeFunction,
			Function: &openai.FunctionDefinition{
				Name:        "preferences",
				Description: "Get the user's recent selected meals from suggestions",
				Parameters: map[string]any{
					"type": "object",
					"properties": map[string]any{
						"uuid": map[string]string{
							"type":        "string",
							"description": "The user's UUID",
						},
					},
					"required": []string{"uuid"},
				},
			},
		},
		{
			Type: openai.ToolTypeFunction,
			Function: &openai.FunctionDefinition{
				Name:        "feedback",
				Description: "Get the user's recent feedback on meals",
				Parameters: map[string]any{
					"type": "object",
					"properties": map[string]any{
						"uuid": map[string]string{
							"type":        "string",
							"description": "The user's UUID",
						},
					},
					"required": []string{"uuid"},
				},
			},
		},
	}

	// Step 1: First GPT response (may trigger tool call)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:      openai.GPT3Dot5Turbo,
			Messages:   []openai.ChatCompletionMessage{userMessage},
			Tools:      tools,
			ToolChoice: "auto", // GPT chooses whether to use a tool
		},
	)
	if err != nil {
		fmt.Println("OpenAI API Error:", err)
		return "How about a warm bowl of ramen?"
	}

	// Step 2: If GPT wants to call a tool
	toolCalls := resp.Choices[0].Message.ToolCalls
	if len(toolCalls) > 0 {
		toolResponses := []openai.ChatCompletionMessage{
			userMessage,
			resp.Choices[0].Message, // tool_call message
		}

		for _, call := range toolCalls {
			var args struct{ UUID string }
			if err := json.Unmarshal([]byte(call.Function.Arguments), &args); err != nil {
				log.Println("Tool arg parsing error:", err)
				continue
			}
			if args.UUID == "" {
				log.Println("Tool call skipped — empty UUID")
				continue
			}

			var toolResult string
			log.Printf("Calling tool: %s for UUID: %s\n", call.Function.Name, args.UUID)

			switch call.Function.Name {
			case "preferences":
				toolResult = GetRecentPreferenceData(args.UUID)
			case "feedback":
				toolResult = GetRecentFeedbackData(args.UUID)
			default:
				log.Printf("Unknown tool name: %s\n", call.Function.Name)
				toolResult = "{}"
			}

			toolResponses = append(toolResponses, openai.ChatCompletionMessage{
				Role:       "tool",
				ToolCallID: call.ID,
				Name:       call.Function.Name,
				Content:    toolResult,
			})
		}

		// ✅ All tool results are collected — now call GPT once with all of them
		finalResp, err := client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model:    openai.GPT3Dot5Turbo,
				Messages: toolResponses,
			},
		)
		if err != nil || len(finalResp.Choices) == 0 {
			log.Println("OpenAI tool follow-up error:", err)
			return "Here's a fallback meal idea: pasta with tomato sauce."
		}

		return finalResp.Choices[0].Message.Content

	}

	// No tool call — GPT gave final answer
	return resp.Choices[0].Message.Content
}
