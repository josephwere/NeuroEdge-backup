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

func NewReasoningAgent(bus *core.EventBus) *ReasoningAgent {
	return &ReasoningAgent{
		EventBus: bus,
		Name:     "ReasoningAgent",
	}
}

func (a *ReasoningAgent) Start() {
	fmt.Printf("🚀 %s started\n", a.Name)
	ch := make(chan core.Event)
	a.EventBus.Subscribe("TaskResult", ch)

	go func() {
		for evt := range ch {
			fmt.Printf("[%s] received task result: %v\n", a.Name, evt.Data)
			time.Sleep(500 * time.Millisecond) // simulate reasoning
			result := fmt.Sprintf("%s reasoning completed on: %v", a.Name, evt.Data)
			a.EventBus.Publish(core.Event{Name: "DecisionEvent", Data: result})
			fmt.Printf("[%s] published reasoning result: %s\n", a.Name, result)
		}
	}()
}

func (a *ReasoningAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", a.Name)
}

func (a *ReasoningAgent) NameFunc() string {
	return a.Name
}
