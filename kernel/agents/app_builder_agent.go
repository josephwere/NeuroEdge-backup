// kernel/agents/app_builder_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type AppBuilderAgent struct {
	EventBus *types.EventBus
}

func NewAppBuilderAgent(bus *types.EventBus) *AppBuilderAgent {
	return &AppBuilderAgent{
		EventBus: bus,
	}
}

func (a *AppBuilderAgent) Start() {
	fmt.Println("🚀 AppBuilderAgent started")

	// Subscribe directly with a function
	a.EventBus.Subscribe("app:build", func(event types.Event) {
		fmt.Println("[AppBuilderAgent] Build Event:", event.Data)

		// ✅ Type assertion to map[string]interface{}
		data, ok := event.Data.(map[string]interface{})
		if !ok {
			fmt.Println("[AppBuilderAgent] Warning: event.Data is not a map:", event.Data)
			return
		}

		a.BuildApp(data)
	})
}

func (a *AppBuilderAgent) Stop() {
	fmt.Println("🛑 AppBuilderAgent stopped")
}

func (a *AppBuilderAgent) Name() string {
	return "AppBuilderAgent"
}

func (a *AppBuilderAgent) BuildApp(data map[string]interface{}) {
	fmt.Println("[AppBuilderAgent] Building full-stack app:", data)
}
