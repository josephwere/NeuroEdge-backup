// kernel/agents/mining_controller_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types to avoid core import cycle
)

type MiningControllerAgent struct {
	EventBus *types.EventBus
}

func NewMiningControllerAgent(bus *types.EventBus) *MiningControllerAgent {
	return &MiningControllerAgent{
		EventBus: bus,
	}
}

func (m *MiningControllerAgent) Start() {
	fmt.Println("🚀 MiningControllerAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("mining:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[MiningControllerAgent] Mining Event:", event)
			m.ManageMining(event)
		}
	}()
}

func (m *MiningControllerAgent) Stop() {
	fmt.Println("🛑 MiningControllerAgent stopped")
}

func (m *MiningControllerAgent) Name() string {
	return "MiningControllerAgent"
}

func (m *MiningControllerAgent) ManageMining(data map[string]interface{}) {
	fmt.Println("[MiningControllerAgent] Mining operation:", data)
}
