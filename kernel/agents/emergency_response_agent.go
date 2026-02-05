// kernel/agents/emergency_response_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type EmergencyResponseAgent struct {
	EventBus *types.EventBus
}

func NewEmergencyResponseAgent(bus *types.EventBus) *EmergencyResponseAgent {
	return &EmergencyResponseAgent{
		EventBus: bus,
	}
}

func (e *EmergencyResponseAgent) Start() {
	fmt.Println("🚀 EmergencyResponseAgent started")
	ch := make(chan map[string]interface{})
	e.EventBus.Subscribe("emergency:alert", ch)
	go func() {
		for event := range ch {
			fmt.Println("[EmergencyResponseAgent] Emergency Alert:", event)
			e.DispatchTeam(event)
		}
	}()
}

func (e *EmergencyResponseAgent) Stop() {
	fmt.Println("🛑 EmergencyResponseAgent stopped")
}

func (e *EmergencyResponseAgent) Name() string {
	return "EmergencyResponseAgent"
}

// Dispatch response team
func (e *EmergencyResponseAgent) DispatchTeam(alert map[string]interface{}) {
	fmt.Println("[EmergencyResponseAgent] Dispatching emergency team for:", alert)
}
