// kernel/agents/robot_assistant_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// RobotAssistantAgent handles robot commands
type RobotAssistantAgent struct {
	EventBus *core.EventBus
	Name     string
}

func NewRobotAssistantAgent(bus *core.EventBus) *RobotAssistantAgent {
	return &RobotAssistantAgent{
		EventBus: bus,
		Name:     "RobotAssistantAgent",
	}
}

func (r *RobotAssistantAgent) Start() {
	fmt.Printf("🚀 %s started\n", r.Name)
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("robot:command", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Robot Command: %v\n", r.Name, event)
			r.ControlRobot(event)
		}
	}()
}

func (r *RobotAssistantAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

func (r *RobotAssistantAgent) NameFunc() string {
	return r.Name
}

func (r *RobotAssistantAgent) ControlRobot(data map[string]interface{}) {
	fmt.Printf("[%s] Robot action: %v\n", r.Name, data)
}
