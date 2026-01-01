package agents

import (
	"fmt"
	"NeuroEdge/kernel/core"
)

type SecurityAgent struct {
	Name string
}

func NewSecurityAgent() *SecurityAgent {
	return &SecurityAgent{
		Name: "SecurityAgent",
	}
}

func (s *SecurityAgent) Start() {
	fmt.Printf("[%s] monitoring system for security threats...\n", s.Name)
	core.EventBus.Subscribe("task:new", s.HandleEvent)
}

func (s *SecurityAgent) HandleEvent(event string, payload interface{}) {
	task := fmt.Sprintf("%v", payload)
	fmt.Printf("[%s] analyzing task for threats: %s\n", s.Name, task)
	// Example: Block dangerous tasks
	allowed := s.Analyze(task)
	if !allowed {
		fmt.Printf("[%s] blocked task: %s\n", s.Name, task)
	}
}

func (s *SecurityAgent) Analyze(task string) bool {
	// TODO: integrate ML threat detection
	// For now, all tasks are allowed
	return true
}

func (s *SecurityAgent) GetName() string {
	return s.Name
}
