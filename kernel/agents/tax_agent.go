// kernel/agents/tax_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ use types instead of core
)

type TaxAgent struct {
	EventBus *types.EventBus
}

func NewTaxAgent(bus *types.EventBus) *TaxAgent {
	return &TaxAgent{
		EventBus: bus,
	}
}

func (t *TaxAgent) Start() {
	fmt.Println("🚀 TaxAgent started")

	ch := make(chan map[string]interface{})
	t.EventBus.Subscribe("tax:calculate", ch)

	go func() {
		for event := range ch {
			fmt.Println("[TaxAgent] Tax Calculation Event:", event)
			t.CalculateTax(event)
		}
	}()
}

func (t *TaxAgent) Stop() {
	fmt.Println("🛑 TaxAgent stopped")
}

func (t *TaxAgent) Name() string {
	return "TaxAgent"
}

func (t *TaxAgent) CalculateTax(data map[string]interface{}) {
	fmt.Println("[TaxAgent] Calculating tax for:", data)
}
