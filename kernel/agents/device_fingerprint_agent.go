// kernel/agents/device_fingerprint_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type DeviceFingerprintAgent struct {
	EventBus *types.EventBus
}

func NewDeviceFingerprintAgent(bus *types.EventBus) *DeviceFingerprintAgent {
	return &DeviceFingerprintAgent{
		EventBus: bus,
	}
}

func (d *DeviceFingerprintAgent) Start() {
	fmt.Println("🚀 DeviceFingerprintAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("device:fingerprint", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DeviceFingerprintAgent] Fingerprint Event:", event)
			d.AnalyzeDevice(event)
		}
	}()
}

func (d *DeviceFingerprintAgent) Stop() {
	fmt.Println("🛑 DeviceFingerprintAgent stopped")
}

func (d *DeviceFingerprintAgent) Name() string {
	return "DeviceFingerprintAgent"
}

func (d *DeviceFingerprintAgent) AnalyzeDevice(data map[string]interface{}) {
	fmt.Println("[DeviceFingerprintAgent] Device fingerprint analysis:", data)
}
