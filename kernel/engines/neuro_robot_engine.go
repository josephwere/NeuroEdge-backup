package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroRobotEngine struct {
	EventBus *core.EventBus
}

func NewNeuroRobotEngine(bus *core.EventBus) *NeuroRobotEngine {
	return &NeuroRobotEngine{
		EventBus: bus,
	}
}

func (n *NeuroRobotEngine) Start() {
	fmt.Println("🚀 NeuroRobotEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("robot:control", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroRobotEngine] Robot Control Event:", event)
			n.ControlRobot(event)
		}
	}()
}

func (n *NeuroRobotEngine) Stop() {
	fmt.Println("🛑 NeuroRobotEngine stopped")
}

func (n *NeuroRobotEngine) Name() string {
	return "NeuroRobotEngine"
}

func (n *NeuroRobotEngine) ControlRobot(data map[string]interface{}) {
	fmt.Println("[NeuroRobotEngine] Robot action executed:", data)
}
