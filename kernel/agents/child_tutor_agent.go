package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type ChildTutorAgent struct {
	EventBus *core.EventBus
}

func NewChildTutorAgent(bus *core.EventBus) *ChildTutorAgent {
	return &ChildTutorAgent{
		EventBus: bus,
	}
}

func (c *ChildTutorAgent) Start() {
	fmt.Println("🚀 ChildTutorAgent started")
	ch := make(chan map[string]interface{})
	c.EventBus.Subscribe("tutor:session", ch)
	go func() {
		for event := range ch {
			fmt.Println("[ChildTutorAgent] Tutoring Event:", event)
			c.TutorChild(event)
		}
	}()
}

func (c *ChildTutorAgent) Stop() {
	fmt.Println("🛑 ChildTutorAgent stopped")
}

func (c *ChildTutorAgent) Name() string {
	return "ChildTutorAgent"
}

func (c *ChildTutorAgent) TutorChild(data map[string]interface{}) {
	fmt.Println("[ChildTutorAgent] Teaching child:", data)
}
