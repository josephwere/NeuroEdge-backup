// kernel/agents/device_guardian_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type DeviceGuardianAgent struct {
	EventBus *types.EventBus
}

func NewDeviceGuardianAgent(bus *types.EventBus) *DeviceGuardianAgent {
	return &DeviceGuardianAgent{
		EventBus: bus,
	}
}

func (d *DeviceGuardianAgent) Start() {
	fmt.Println("🚀 DeviceGuardianAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("device:alert", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DeviceGuardianAgent] Device Event:", event)
			d.ProtectDevice(event)
		}
	}()
}

func (d *DeviceGuardianAgent) Stop() {
	fmt.Println("🛑 DeviceGuardianAgent stopped")
}

func (d *DeviceGuardianAgent) Name() string {
	return "DeviceGuardianAgent"
}

func (d *DeviceGuardianAgent) ProtectDevice(data map[string]interface{}) {
	fmt.Println("[DeviceGuardianAgent] Protection action:", data)
}
