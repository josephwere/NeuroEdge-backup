// kernel/agents/lawyer_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type LawyerAgent struct {
	EventBus *types.EventBus
}

func NewLawyerAgent(bus *types.EventBus) *LawyerAgent {
	return &LawyerAgent{
		EventBus: bus,
	}
}

func (l *LawyerAgent) Start() {
	fmt.Println("🚀 LawyerAgent started")
	ch := make(chan map[string]interface{})
	l.EventBus.Subscribe("legal:consult", ch)
	go func() {
		for event := range ch {
			fmt.Println("[LawyerAgent] Legal Consultation Event:", event)
			l.ProvideAdvice(event)
		}
	}()
}

func (l *LawyerAgent) Stop() {
	fmt.Println("🛑 LawyerAgent stopped")
}

func (l *LawyerAgent) Name() string {
	return "LawyerAgent"
}

func (l *LawyerAgent) ProvideAdvice(data map[string]interface{}) {
	fmt.Println("[LawyerAgent] Providing legal advice:", data)
}
