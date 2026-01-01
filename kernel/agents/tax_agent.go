package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type TaxAgent struct {
	EventBus *core.EventBus
}

func NewTaxAgent(bus *core.EventBus) *TaxAgent {
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
