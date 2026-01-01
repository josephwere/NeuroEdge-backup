package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroGPTEngine struct {
	EventBus *core.EventBus
}

func NewNeuroGPTEngine(bus *core.EventBus) *NeuroGPTEngine {
	return &NeuroGPTEngine{
		EventBus: bus,
	}
}

func (n *NeuroGPTEngine) Start() {
	fmt.Println("🚀 NeuroGPTEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("gpt:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroGPTEngine] GPT Event:", event)
			n.GenerateResponse(event)
		}
	}()
}

func (n *NeuroGPTEngine) Stop() {
	fmt.Println("🛑 NeuroGPTEngine stopped")
}

func (n *NeuroGPTEngine) Name() string {
	return "NeuroGPTEngine"
}

func (n *NeuroGPTEngine) GenerateResponse(data map[string]interface{}) {
	fmt.Println("[NeuroGPTEngine] Generated response:", data)
}
