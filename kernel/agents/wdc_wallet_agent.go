// kernel/agents/wdc_wallet_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ switched from core to types
)

type WDCWalletAgent struct {
	EventBus *types.EventBus
}

func NewWDCWalletAgent(bus *types.EventBus) *WDCWalletAgent {
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

// ProcessTransaction handles wallet transactions
func (w *WDCWalletAgent) ProcessTransaction(tx map[string]interface{}) {
	fmt.Println("[WDCWalletAgent] Processing WDC transaction:", tx)
}
