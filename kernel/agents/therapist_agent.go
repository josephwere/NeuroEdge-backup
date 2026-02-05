// kernel/agents/therapist_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ use types instead of core
)

type TherapistAgent struct {
	EventBus *types.EventBus
}

func NewTherapistAgent(bus *types.EventBus) *TherapistAgent {
	return &TherapistAgent{
		EventBus: bus,
	}
}

func (t *TherapistAgent) Start() {
	fmt.Println("🚀 TherapistAgent started")

	ch := make(chan map[string]interface{})
	t.EventBus.Subscribe("therapy:session", ch)

	go func() {
		for event := range ch {
			fmt.Println("[TherapistAgent] Therapy Session Event:", event)
			t.ProvideSupport(event)
		}
	}()
}

func (t *TherapistAgent) Stop() {
	fmt.Println("🛑 TherapistAgent stopped")
}

func (t *TherapistAgent) Name() string {
	return "TherapistAgent"
}

func (t *TherapistAgent) ProvideSupport(data map[string]interface{}) {
	fmt.Println("[TherapistAgent] Providing support:", data)
}
