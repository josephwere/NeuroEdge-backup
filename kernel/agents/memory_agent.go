// kernel/agents/memory_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types to break core dependency
)

type MemoryAgent struct {
	EventBus *types.EventBus
}

func NewMemoryAgent(bus *types.EventBus) *MemoryAgent {
	return &MemoryAgent{
		EventBus: bus,
	}
}

func (m *MemoryAgent) Start() {
	fmt.Println("🚀 MemoryAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("memory:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[MemoryAgent] Memory Event:", event)
			m.UpdateMemory(event)
		}
	}()
}

func (m *MemoryAgent) Stop() {
	fmt.Println("🛑 MemoryAgent stopped")
}

func (m *MemoryAgent) Name() string {
	return "MemoryAgent"
}

func (m *MemoryAgent) UpdateMemory(data map[string]interface{}) {
	fmt.Println("[MemoryAgent] Memory updated:", data)
}
