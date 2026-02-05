// kernel/agents/anti_theft_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types" // <- use types instead of core
)

type AntiTheftAgent struct {
	EventBus types.EventBus
}

func NewAntiTheftAgent(bus types.EventBus) *AntiTheftAgent {
	return &AntiTheftAgent{
		EventBus: bus,
	}
}

func (a *AntiTheftAgent) Start() {
	fmt.Println("🚀 AntiTheftAgent started")
	ch := make(chan types.Event) // <- use types.Event
	a.EventBus.Subscribe("device:stolen", ch)
	go func() {
		for event := range ch {
			fmt.Println("[AntiTheftAgent] Device Stolen Alert:", event)
			a.LockDevice(event["deviceID"].(string))
		}
	}()
}

func (a *AntiTheftAgent) Stop() {
	fmt.Println("🛑 AntiTheftAgent stopped")
}

func (a *AntiTheftAgent) Name() string {
	return "AntiTheftAgent"
}

// Example: Lock a stolen device
func (a *AntiTheftAgent) LockDevice(deviceID string) {
	fmt.Printf("[AntiTheftAgent] Locking device %s remotely\n", deviceID)
}
