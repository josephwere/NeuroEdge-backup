// kernel/agents/world_knowledge_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ use types, not core
)

type WorldKnowledgeAgent struct {
	EventBus *types.EventBus
}

func NewWorldKnowledgeAgent(bus *types.EventBus) *WorldKnowledgeAgent {
	return &WorldKnowledgeAgent{
		EventBus: bus,
	}
}

func (w *WorldKnowledgeAgent) Start() {
	fmt.Println("🚀 WorldKnowledgeAgent started")

	ch := make(chan map[string]interface{})
	w.EventBus.Subscribe("knowledge:update", ch)

	go func() {
		for event := range ch {
			fmt.Println("[WorldKnowledgeAgent] Knowledge Event:", event)
			w.UpdateKnowledge(event)
		}
	}()
}

func (w *WorldKnowledgeAgent) Stop() {
	fmt.Println("🛑 WorldKnowledgeAgent stopped")
}

func (w *WorldKnowledgeAgent) Name() string {
	return "WorldKnowledgeAgent"
}

func (w *WorldKnowledgeAgent) UpdateKnowledge(data map[string]interface{}) {
	fmt.Println("[WorldKnowledgeAgent] Knowledge metrics:", data)
}
