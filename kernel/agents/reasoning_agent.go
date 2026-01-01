package agents

import (
	"fmt"
	"time"

	"NeuroEdge/kernel/core"
)

// ReasoningAgent performs high-level decision-making
type ReasoningAgent struct {
	name string
}

// NewReasoningAgent creates a new ReasoningAgent instance
func NewReasoningAgent() *ReasoningAgent {
	return &ReasoningAgent{name: "ReasoningAgent"}
}

// Name returns the agent name
func (a *ReasoningAgent) Name() string {
	return a.name
}

// Start subscribes to events and begins reasoning
func (a *ReasoningAgent) Start() {
	core.Info(a.Name() + " starting...")

	// Subscribe to TaskResult events from TaskAgent
	ch := make(chan core.Event)
	core.GetKernel().EventBus.Subscribe("TaskResult", ch)

	go func() {
		for evt := range ch {
			core.Info(fmt.Sprintf("%s received task result: %v", a.Name(), evt.Data))
			// Perform reasoning (mock logic)
			time.Sleep(500 * time.Millisecond) // simulate decision process

			// Emit reasoning result
			core.GetKernel().EventBus.Publish(core.Event{
				Name: "DecisionEvent",
				Data: fmt.Sprintf("%s reasoning completed on: %v", a.Name(), evt.Data),
			})
			core.Info(fmt.Sprintf("%s published reasoning result.", a.Name()))
		}
	}()
}

// Stop gracefully stops the agent
func (a *ReasoningAgent) Stop() {
	core.Info(a.Name() + " stopped.")
}
