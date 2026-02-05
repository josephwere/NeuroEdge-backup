// kernel/agents/personal_wdc_assistant_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core to avoid cycles
)

type PersonalWDCAssistantAgent struct {
	EventBus *types.EventBus
}

func NewPersonalWDCAssistantAgent(bus *types.EventBus) *PersonalWDCAssistantAgent {
	return &PersonalWDCAssistantAgent{
		EventBus: bus,
	}
}

func (p *PersonalWDCAssistantAgent) Start() {
	fmt.Println("🚀 PersonalWDCAssistantAgent started")
	ch := make(chan map[string]interface{})
	p.EventBus.Subscribe("wdc:user:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[PersonalWDCAssistantAgent] WDC Event:", event)
			p.ManageUserWallet(event)
		}
	}()
}

func (p *PersonalWDCAssistantAgent) Stop() {
	fmt.Println("🛑 PersonalWDCAssistantAgent stopped")
}

func (p *PersonalWDCAssistantAgent) Name() string {
	return "PersonalWDCAssistantAgent"
}

func (p *PersonalWDCAssistantAgent) ManageUserWallet(data map[string]interface{}) {
	fmt.Println("[PersonalWDCAssistantAgent] Wallet action:", data)
}
