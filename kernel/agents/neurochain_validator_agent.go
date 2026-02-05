// kernel/agents/neurochain_validator_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types to break import cycle
)

type NeuroChainValidatorAgent struct {
	EventBus *types.EventBus
}

func NewNeuroChainValidatorAgent(bus *types.EventBus) *NeuroChainValidatorAgent {
	return &NeuroChainValidatorAgent{
		EventBus: bus,
	}
}

func (n *NeuroChainValidatorAgent) Start() {
	fmt.Println("🚀 NeuroChainValidatorAgent started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("block:new", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroChainValidatorAgent] New block received:", event)
			n.ValidateBlock(event)
		}
	}()
}

func (n *NeuroChainValidatorAgent) Stop() {
	fmt.Println("🛑 NeuroChainValidatorAgent stopped")
}

func (n *NeuroChainValidatorAgent) Name() string {
	return "NeuroChainValidatorAgent"
}

// Example: Validate new block
func (n *NeuroChainValidatorAgent) ValidateBlock(block map[string]interface{}) {
	fmt.Println("[NeuroChainValidatorAgent] Validating block:", block)
}
