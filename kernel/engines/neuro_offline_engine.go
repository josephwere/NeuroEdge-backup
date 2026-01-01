package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroOfflineEngine struct {
	EventBus *core.EventBus
}

func NewNeuroOfflineEngine(bus *core.EventBus) *NeuroOfflineEngine {
	return &NeuroOfflineEngine{
		EventBus: bus,
	}
}

func (n *NeuroOfflineEngine) Start() {
	fmt.Println("🚀 NeuroOfflineEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("offline:sync", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroOfflineEngine] Offline Sync Event:", event)
			n.HandleOffline(event)
		}
	}()
}

func (n *NeuroOfflineEngine) Stop() {
	fmt.Println("🛑 NeuroOfflineEngine stopped")
}

func (n *NeuroOfflineEngine) Name() string {
	return "NeuroOfflineEngine"
}

func (n *NeuroOfflineEngine) HandleOffline(data map[string]interface{}) {
	fmt.Println("[NeuroOfflineEngine] Offline processing executed:", data)
}
