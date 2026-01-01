package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type AppBuilderAgent struct {
	EventBus *core.EventBus
}

func NewAppBuilderAgent(bus *core.EventBus) *AppBuilderAgent {
	return &AppBuilderAgent{
		EventBus: bus,
	}
}

func (a *AppBuilderAgent) Start() {
	fmt.Println("🚀 AppBuilderAgent started")
	ch := make(chan map[string]interface{})
	a.EventBus.Subscribe("app:build", ch)
	go func() {
		for event := range ch {
			fmt.Println("[AppBuilderAgent] Build Event:", event)
			a.BuildApp(event)
		}
	}()
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
