package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type WDCTraderAgent struct {
	EventBus *core.EventBus
}

func NewWDCTraderAgent(bus *core.EventBus) *WDCTraderAgent {
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
