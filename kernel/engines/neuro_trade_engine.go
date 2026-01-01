package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroTradeEngine struct {
	EventBus *core.EventBus
}

func NewNeuroTradeEngine(bus *core.EventBus) *NeuroTradeEngine {
	return &NeuroTradeEngine{
		EventBus: bus,
	}
}

func (n *NeuroTradeEngine) Start() {
	fmt.Println("🚀 NeuroTradeEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("trade:execute", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroTradeEngine] Trade Event:", event)
			n.ManageTrade(event)
		}
	}()
}

func (n *NeuroTradeEngine) Stop() {
	fmt.Println("🛑 NeuroTradeEngine stopped")
}

func (n *NeuroTradeEngine) Name() string {
	return "NeuroTradeEngine"
}

func (n *NeuroTradeEngine) ManageTrade(data map[string]interface{}) {
	fmt.Println("[NeuroTradeEngine] Trade executed:", data)
}
