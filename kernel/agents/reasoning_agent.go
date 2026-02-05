// kernel/agents/reasoning_agent.go
package agents

import (
	"fmt"
	"time"

	"neuroedge/kernel/core"
)

// ReasoningAgent performs high-level decision-making
type ReasoningAgent struct {
	EventBus *core.EventBus
	Name     string
}

// NewReasoningAgent creates a new ReasoningAgent instance
func NewReasoningAgent(bus *core.EventBus) *ReasoningAgent {
	return &ReasoningAgent{
		EventBus: bus,
		Name:     "ReasoningAgent",
	}
}

// Start subscribes to TaskResult events and begins reasoning
func (a *ReasoningAgent) Start() {
	fmt.Printf("🚀 %s started\n", a.Name)

	ch := make(chan core.Event)
	a.EventBus.Subscribe("TaskResult", ch)

	go func() {
		for evt := range ch {
			fmt.Printf("[%s] received task result: %v\n", a.Name, evt.Data)
			
			// Simulate reasoning process
			time.Sleep(500 * time.Millisecond)

			result := fmt.Sprintf("%s reasoning completed on: %v", a.Name, evt.Data)
			a.EventBus.Publish(core.Event{
				Name: "DecisionEvent",
				Data: result,
			})

			fmt.Printf("[%s] published reasoning result: %s\n", a.Name, result)
		}
	}()
}

// Stop gracefully stops the agent
func (a *ReasoningAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", a.Name)
}
