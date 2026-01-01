package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroCloudEngine struct {
	EventBus *core.EventBus
}

func NewNeuroCloudEngine(bus *core.EventBus) *NeuroCloudEngine {
	return &NeuroCloudEngine{
		EventBus: bus,
	}
}

func (n *NeuroCloudEngine) Start() {
	fmt.Println("🚀 NeuroCloudEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("cloud:task", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroCloudEngine] Cloud Task Event:", event)
			n.HandleCloudTask(event)
		}
	}()
}

func (n *NeuroCloudEngine) Stop() {
	fmt.Println("🛑 NeuroCloudEngine stopped")
}

func (n *NeuroCloudEngine) Name() string {
	return "NeuroCloudEngine"
}

func (n *NeuroCloudEngine) HandleCloudTask(data map[string]interface{}) {
	fmt.Println("[NeuroCloudEngine] Cloud task executed:", data)
}
