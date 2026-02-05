// kernel/agents/home_assistant_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type HomeAssistantAgent struct {
	EventBus *types.EventBus
}

func NewHomeAssistantAgent(bus *types.EventBus) *HomeAssistantAgent {
	return &HomeAssistantAgent{
		EventBus: bus,
	}
}

func (h *HomeAssistantAgent) Start() {
	fmt.Println("🚀 HomeAssistantAgent started")
	ch := make(chan map[string]interface{})
	h.EventBus.Subscribe("home:assistant:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[HomeAssistantAgent] Home Event:", event)
			h.ControlHome(event)
		}
	}()
}

func (h *HomeAssistantAgent) Stop() {
	fmt.Println("🛑 HomeAssistantAgent stopped")
}

func (h *HomeAssistantAgent) Name() string {
	return "HomeAssistantAgent"
}

func (h *HomeAssistantAgent) ControlHome(data map[string]interface{}) {
	fmt.Println("[HomeAssistantAgent] Home environment controlled:", data)
}
