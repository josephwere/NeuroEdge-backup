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

	// Subscribe with function
	a.EventBus.Subscribe("device:stolen", func(event types.Event) {
		fmt.Println("[AntiTheftAgent] Device Stolen Alert:", event)

		// ✅ Safely assert event.Data to map
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[AntiTheftAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		// ✅ Safely extract deviceID
		if deviceID, ok := data["deviceID"].(string); ok {
			a.LockDevice(deviceID)
		} else {
			fmt.Println("[AntiTheftAgent] Warning: deviceID not found or invalid type")
		}
	})
}

func (a *AntiTheftAgent) Stop() {
	fmt.Println("🛑 AntiTheftAgent stopped")
}

// Only method — no Name field
func (a *AntiTheftAgent) Name() string {
	return "AntiTheftAgent"
}

// Lock a stolen device
func (a *AntiTheftAgent) LockDevice(deviceID string) {
	fmt.Printf("[AntiTheftAgent] Locking device %s remotely\n", deviceID)
}
