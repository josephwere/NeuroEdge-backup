package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type WDCWalletAgent struct {
	EventBus *core.EventBus
}

func NewWDCWalletAgent(bus *core.EventBus) *WDCWalletAgent {
	return &WDCWalletAgent{
		EventBus: bus,
	}
}

func (w *WDCWalletAgent) Start() {
	fmt.Println("🚀 WDCWalletAgent started")
	ch := make(chan map[string]interface{})
	w.EventBus.Subscribe("wallet:transaction", ch)
	go func() {
		for event := range ch {
			fmt.Println("[WDCWalletAgent] Transaction Event:", event)
			w.ProcessTransaction(event)
		}
	}()
}

func (w *WDCWalletAgent) Stop() {
	fmt.Println("🛑 WDCWalletAgent stopped")
}

func (w *WDCWalletAgent) Name() string {
	return "WDCWalletAgent"
}

// Example: Process a transaction
func (w *WDCWalletAgent) ProcessTransaction(tx map[string]interface{}) {
	fmt.Println("[WDCWalletAgent] Processing WDC transaction:", tx)
}
