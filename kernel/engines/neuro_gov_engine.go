package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroGovEngine struct {
	EventBus *core.EventBus
}

func NewNeuroGovEngine(bus *core.EventBus) *NeuroGovEngine {
	return &NeuroGovEngine{
		EventBus: bus,
	}
}

func (n *NeuroGovEngine) Start() {
	fmt.Println("🚀 NeuroGovEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("gov:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroGovEngine] Governance Event:", event)
			n.ProcessGov(event)
		}
	}()
}

func (n *NeuroGovEngine) Stop() {
	fmt.Println("🛑 NeuroGovEngine stopped")
}

func (n *NeuroGovEngine) Name() string {
	return "NeuroGovEngine"
}

func (n *NeuroGovEngine) ProcessGov(data map[string]interface{}) {
	fmt.Println("[NeuroGovEngine] Governance processed:", data)
}
