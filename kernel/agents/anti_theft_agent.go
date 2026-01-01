package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type AntiTheftAgent struct {
	EventBus *core.EventBus
}

func NewAntiTheftAgent(bus *core.EventBus) *AntiTheftAgent {
	return &AntiTheftAgent{
		EventBus: bus,
	}
}

func (a *AntiTheftAgent) Start() {
	fmt.Println("🚀 AntiTheftAgent started")
	ch := make(chan map[string]interface{})
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
