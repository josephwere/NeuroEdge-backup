// kernel/agents/anti_theft_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type AntiTheftAgent struct {
	EventBus *types.EventBus
}

func NewAntiTheftAgent(bus *types.EventBus) *AntiTheftAgent {
	return &AntiTheftAgent{
		EventBus: bus,
	}
}

func (a *AntiTheftAgent) Start() {
	fmt.Println("🚀 AntiTheftAgent started")

	// Use subscriber function directly
	a.EventBus.Subscribe("device:stolen", func(event types.Event) {
		fmt.Println("[AntiTheftAgent] Device Stolen Alert:", event)
		if deviceID, ok := event.Data["deviceID"].(string); ok {
			a.LockDevice(deviceID)
		} else {
			fmt.Println("[AntiTheftAgent] Warning: deviceID not found or invalid type")
		}
	})
}

func (a *AntiTheftAgent) Stop() {
	fmt.Println("🛑 AntiTheftAgent stopped")
}

func (a *AntiTheftAgent) Name() string {
	return "AntiTheftAgent"
}

// Lock a stolen device
func (a *AntiTheftAgent) LockDevice(deviceID string) {
	fmt.Printf("[AntiTheftAgent] Locking device %s remotely\n", deviceID)
}
