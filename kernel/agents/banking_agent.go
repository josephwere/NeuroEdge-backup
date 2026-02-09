// kernel/agents/banking_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type BankingAgent struct {
	EventBus *types.EventBus
}

func NewBankingAgent(bus *types.EventBus) *BankingAgent {
	return &BankingAgent{
		EventBus: bus,
	}
}

func (b *BankingAgent) Start() {
	fmt.Println("🚀 BankingAgent started")

	// Subscribe using a function
	b.EventBus.Subscribe("bank:transaction", func(event types.Event) {
		fmt.Println("[BankingAgent] Transaction Event:", event.Data)

		// ✅ Type assertion
		tx, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[BankingAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		b.ProcessTransaction(tx)
	})
}

func (b *BankingAgent) Stop() {
	fmt.Println("🛑 BankingAgent stopped")
}

func (b *BankingAgent) Name() string {
	return "BankingAgent"
}

func (b *BankingAgent) ProcessTransaction(tx map[string]interface{}) {
	fmt.Println("[BankingAgent] Processing transaction:", tx)
}
