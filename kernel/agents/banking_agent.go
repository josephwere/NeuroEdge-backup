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

	// Subscribe using a function, not a channel
	b.EventBus.Subscribe("bank:transaction", func(event types.Event) {
		fmt.Println("[BankingAgent] Transaction Event:", event.Data)
		b.ProcessTransaction(event.Data)
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
