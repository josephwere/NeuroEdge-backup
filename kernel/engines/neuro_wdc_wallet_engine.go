package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroWDCWalletEngine struct {
	EventBus *core.EventBus
}

func NewNeuroWDCWalletEngine(bus *core.EventBus) *NeuroWDCWalletEngine {
	return &NeuroWDCWalletEngine{
		EventBus: bus,
	}
}

func (n *NeuroWDCWalletEngine) Start() {
	fmt.Println("🚀 NeuroWDCWalletEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("wallet:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroWDCWalletEngine] Wallet Event:", event)
			n.ManageWallet(event)
		}
	}()
}

func (n *NeuroWDCWalletEngine) Stop() {
	fmt.Println("🛑 NeuroWDCWalletEngine stopped")
}

func (n *NeuroWDCWalletEngine) Name() string {
	return "NeuroWDCWalletEngine"
}

func (n *NeuroWDCWalletEngine) ManageWallet(data map[string]interface{}) {
	fmt.Println("[NeuroWDCWalletEngine] Wallet processed:", data)
}
