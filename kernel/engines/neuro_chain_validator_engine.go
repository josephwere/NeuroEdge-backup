package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroChainValidatorEngine struct {
	EventBus *core.EventBus
}

func NewNeuroChainValidatorEngine(bus *core.EventBus) *NeuroChainValidatorEngine {
	return &NeuroChainValidatorEngine{
		EventBus: bus,
	}
}

func (n *NeuroChainValidatorEngine) Start() {
	fmt.Println("🚀 NeuroChainValidatorEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("chain:validate", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroChainValidatorEngine] Validator Event:", event)
			n.ValidateBlock(event)
		}
	}()
}

func (n *NeuroChainValidatorEngine) Stop() {
	fmt.Println("🛑 NeuroChainValidatorEngine stopped")
}

func (n *NeuroChainValidatorEngine) Name() string {
	return "NeuroChainValidatorEngine"
}

func (n *NeuroChainValidatorEngine) ValidateBlock(data map[string]interface{}) {
	fmt.Println("[NeuroChainValidatorEngine] Block validated:", data)
}
