package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type WorldKnowledgeAgent struct {
	EventBus *core.EventBus
}

func NewWorldKnowledgeAgent(bus *core.EventBus) *WorldKnowledgeAgent {
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
