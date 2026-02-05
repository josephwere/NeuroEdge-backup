// kernel/agents/drone_controller_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type DroneControllerAgent struct {
	EventBus *types.EventBus
}

func NewDroneControllerAgent(bus *types.EventBus) *DroneControllerAgent {
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

// Execute drone commands
func (d *DroneControllerAgent) ExecuteCommand(cmd map[string]interface{}) {
	fmt.Println("[DroneControllerAgent] Executing drone command:", cmd)
}
