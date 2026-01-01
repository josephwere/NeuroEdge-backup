package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type DroneControllerAgent struct {
	EventBus *core.EventBus
}

func NewDroneControllerAgent(bus *core.EventBus) *DroneControllerAgent {
	return &DroneControllerAgent{
		EventBus: bus,
	}
}

func (d *DroneControllerAgent) Start() {
	fmt.Println("🚀 DroneControllerAgent started")
	ch := make(chan map[string]interface{})
	d.EventBus.Subscribe("drone:command", ch)
	go func() {
		for event := range ch {
			fmt.Println("[DroneControllerAgent] Drone Command Received:", event)
			d.ExecuteCommand(event)
		}
	}()
}

func (d *DroneControllerAgent) Stop() {
	fmt.Println("🛑 DroneControllerAgent stopped")
}

func (d *DroneControllerAgent) Name() string {
	return "DroneControllerAgent"
}

// Example: Execute drone commands
func (d *DroneControllerAgent) ExecuteCommand(cmd map[string]interface{}) {
	fmt.Println("[DroneControllerAgent] Executing drone command:", cmd)
}
