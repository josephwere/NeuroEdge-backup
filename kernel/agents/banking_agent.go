// kernel/agents/banking_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types package instead of core
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
	ch := make(chan map[string]interface{})
	b.EventBus.Subscribe("bank:transaction", ch)
	go func() {
		for event := range ch {
			fmt.Println("[BankingAgent] Transaction Event:", event)
			b.ProcessTransaction(event)
		}
	}()
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
