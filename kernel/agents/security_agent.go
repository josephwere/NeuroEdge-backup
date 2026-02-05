package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type SecurityAgent struct {
	EventBus *types.EventBus
}

func NewSecurityAgent(bus *types.EventBus) *SecurityAgent {
	return &SecurityAgent{
		EventBus: bus,
	}
}

func (s *SecurityAgent) Start() {
	fmt.Println("🛡️ SecurityAgent started")

	ch := make(chan types.Event)
	s.EventBus.Subscribe("task:new", ch)

	go func() {
		for event := range ch {
			task, _ := event.Payload["task"].(string)
			fmt.Println("[SecurityAgent] Analyzing task:", task)

			if !s.Analyze(task) {
				fmt.Println("[SecurityAgent] ❌ Blocked task:", task)

				s.EventBus.Publish(types.Event{
					Type: "task:blocked",
					Payload: map[string]interface{}{
						"task":   task,
						"reason": "security_policy_violation",
					},
				})
			}
		}
	}()
}

func (s *SecurityAgent) Stop() {
	fmt.Println("🛑 SecurityAgent stopped")
}

func (s *SecurityAgent) Name() string {
	return "SecurityAgent"
}

func (s *SecurityAgent) Analyze(task string) bool {
	// TODO: ML / rules engine
	return true
}
