package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroCEOEngine struct {
	EventBus *core.EventBus
}

func NewNeuroCEOEngine(bus *core.EventBus) *NeuroCEOEngine {
	return &NeuroCEOEngine{
		EventBus: bus,
	}
}

func (n *NeuroCEOEngine) Start() {
	fmt.Println("🚀 NeuroCEOEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("business:strategy", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroCEOEngine] Business Event:", event)
			n.AdviseCEO(event)
		}
	}()
}

func (n *NeuroCEOEngine) Stop() {
	fmt.Println("🛑 NeuroCEOEngine stopped")
}

func (n *NeuroCEOEngine) Name() string {
	return "NeuroCEOEngine"
}

func (n *NeuroCEOEngine) AdviseCEO(data map[string]interface{}) {
	fmt.Println("[NeuroCEOEngine] Business strategy processed:", data)
}
