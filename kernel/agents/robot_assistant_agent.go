package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type RobotAssistantAgent struct {
	EventBus *core.EventBus
}

func NewRobotAssistantAgent(bus *core.EventBus) *RobotAssistantAgent {
	return &RobotAssistantAgent{
		EventBus: bus,
	}
}

func (r *RobotAssistantAgent) Start() {
	fmt.Println("🚀 RobotAssistantAgent started")
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("robot:command", ch)
	go func() {
		for event := range ch {
			fmt.Println("[RobotAssistantAgent] Robot Command:", event)
			r.ControlRobot(event)
		}
	}()
}

func (r *RobotAssistantAgent) Stop() {
	fmt.Println("🛑 RobotAssistantAgent stopped")
}

func (r *RobotAssistantAgent) Name() string {
	return "RobotAssistantAgent"
}

func (r *RobotAssistantAgent) ControlRobot(data map[string]interface{}) {
	fmt.Println("[RobotAssistantAgent] Robot action:", data)
}
