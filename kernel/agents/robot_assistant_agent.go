// kernel/agents/robot_assistant_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// RobotAssistantAgent handles robot control commands
type RobotAssistantAgent struct {
	EventBus *core.EventBus
	Name     string
}

// NewRobotAssistantAgent creates a new RobotAssistantAgent instance
func NewRobotAssistantAgent(bus *core.EventBus) *RobotAssistantAgent {
	return &RobotAssistantAgent{
		EventBus: bus,
		Name:     "RobotAssistantAgent",
	}
}

// Start subscribes to robot command events
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

// Stop gracefully stops the agent
func (r *RobotAssistantAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

// NameFunc returns the agent's name
func (r *RobotAssistantAgent) NameFunc() string {
	return r.Name
}

// ControlRobot executes robot commands
func (r *RobotAssistantAgent) ControlRobot(data map[string]interface{}) {
	fmt.Printf("[%s] Robot action: %v\n", r.Name, data)
}
