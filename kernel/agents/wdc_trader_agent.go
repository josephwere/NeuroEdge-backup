// kernel/agents/wdc_trader_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ switched from core to types
)

type WDCTraderAgent struct {
	EventBus *types.EventBus
}

func NewWDCTraderAgent(bus *types.EventBus) *WDCTraderAgent {
	return &WDCTraderAgent{
		EventBus: bus,
	}
}

func (w *WDCTraderAgent) Start() {
	fmt.Println("🚀 WDCTraderAgent started")

	ch := make(chan map[string]interface{})
	w.EventBus.Subscribe("wdc:trade", ch)

	go func() {
		for event := range ch {
			fmt.Println("[WDCTraderAgent] Trade Event:", event)
			w.ExecuteTrade(event)
		}
	}()
}

func (w *WDCTraderAgent) Stop() {
	fmt.Println("🛑 WDCTraderAgent stopped")
}

func (w *WDCTraderAgent) Name() string {
	return "WDCTraderAgent"
}

func (w *WDCTraderAgent) ExecuteTrade(data map[string]interface{}) {
	fmt.Println("[WDCTraderAgent] Executing WDC trade:", data)
}
