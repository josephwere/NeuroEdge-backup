package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroSearchEngine struct {
	EventBus *core.EventBus
}

func NewNeuroSearchEngine(bus *core.EventBus) *NeuroSearchEngine {
	return &NeuroSearchEngine{
		EventBus: bus,
	}
}

func (n *NeuroSearchEngine) Start() {
	fmt.Println("🚀 NeuroSearchEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("search:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroSearchEngine] Search Event:", event)
			n.ExecuteSearch(event)
		}
	}()
}

func (n *NeuroSearchEngine) Stop() {
	fmt.Println("🛑 NeuroSearchEngine stopped")
}

func (n *NeuroSearchEngine) Name() string {
	return "NeuroSearchEngine"
}

func (n *NeuroSearchEngine) ExecuteSearch(data map[string]interface{}) {
	fmt.Println("[NeuroSearchEngine] Search executed:", data)
}
