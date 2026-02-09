// kernel/agents/child_tutor_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type ChildTutorAgent struct {
	EventBus *types.EventBus
}

func NewChildTutorAgent(bus *types.EventBus) *ChildTutorAgent {
	return &ChildTutorAgent{
		EventBus: bus,
	}
}

func (c *ChildTutorAgent) Start() {
	fmt.Println("🚀 ChildTutorAgent started")

	// ✅ Subscribe directly with a function
	c.EventBus.Subscribe("tutor:session", func(event types.Event) {
		fmt.Println("[ChildTutorAgent] Tutoring Event:", event.Data)

		// ✅ Type assertion
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[ChildTutorAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		c.TutorChild(data)
	})
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
