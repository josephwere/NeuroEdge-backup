package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type VehicleControllerAgent struct {
	EventBus *core.EventBus
}

func NewVehicleControllerAgent(bus *core.EventBus) *VehicleControllerAgent {
	return &VehicleControllerAgent{
		EventBus: bus,
	}
}

func (v *VehicleControllerAgent) Start() {
	fmt.Println("🚀 VehicleControllerAgent started")
	ch := make(chan map[string]interface{})
	v.EventBus.Subscribe("vehicle:control:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[VehicleControllerAgent] Vehicle Event:", event)
			v.ControlVehicle(event)
		}
	}()
}

func (v *VehicleControllerAgent) Stop() {
	fmt.Println("🛑 VehicleControllerAgent stopped")
}

func (v *VehicleControllerAgent) Name() string {
	return "VehicleControllerAgent"
}

func (v *VehicleControllerAgent) ControlVehicle(data map[string]interface{}) {
	fmt.Println("[VehicleControllerAgent] Vehicle controlled:", data)
}
