package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroFinanceEngine struct {
	EventBus *core.EventBus
}

func NewNeuroFinanceEngine(bus *core.EventBus) *NeuroFinanceEngine {
	return &NeuroFinanceEngine{
		EventBus: bus,
	}
}

func (n *NeuroFinanceEngine) Start() {
	fmt.Println("🚀 NeuroFinanceEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("finance:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroFinanceEngine] Finance Event:", event)
			n.ProcessFinance(event)
		}
	}()
}

func (n *NeuroFinanceEngine) Stop() {
	fmt.Println("🛑 NeuroFinanceEngine stopped")
}

func (n *NeuroFinanceEngine) Name() string {
	return "NeuroFinanceEngine"
}

func (n *NeuroFinanceEngine) ProcessFinance(data map[string]interface{}) {
	fmt.Println("[NeuroFinanceEngine] Finance processed:", data)
}
