package agents

import (
	"fmt"
	"time"

	"neuroedge/kernel/types"
)

// ReasoningAgent performs high-level decision-making
type ReasoningAgent struct {
	EventBus *types.EventBus
}

func NewReasoningAgent(bus *types.EventBus) *ReasoningAgent {
	return &ReasoningAgent{
		EventBus: bus,
	}
}

func (r *ReasoningAgent) Start() {
	fmt.Println("🚀 ReasoningAgent started")
	ch := make(chan types.Event)
	r.EventBus.Subscribe("TaskResult", ch)

	go func() {
		for evt := range ch {
			fmt.Println("[ReasoningAgent] Task Result:", evt.Data)
			time.Sleep(500 * time.Millisecond)

			r.EventBus.Publish(types.Event{
				Name: "DecisionEvent",
				Data: fmt.Sprintf("Reasoning completed on: %v", evt.Data),
			})
		}
	}()
}

func (r *ReasoningAgent) Stop() {
	fmt.Println("🛑 ReasoningAgent stopped")
}

func (r *ReasoningAgent) Name() string {
	return "ReasoningAgent"
}
