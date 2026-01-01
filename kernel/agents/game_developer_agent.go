package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type GameDeveloperAgent struct {
	EventBus *core.EventBus
}

func NewGameDeveloperAgent(bus *core.EventBus) *GameDeveloperAgent {
	return &GameDeveloperAgent{
		EventBus: bus,
	}
}

func (g *GameDeveloperAgent) Start() {
	fmt.Println("🚀 GameDeveloperAgent started")
	ch := make(chan map[string]interface{})
	g.EventBus.Subscribe("game:dev", ch)
	go func() {
		for event := range ch {
			fmt.Println("[GameDeveloperAgent] Game Dev Event:", event)
			g.DevGame(event)
		}
	}()
}

func (g *GameDeveloperAgent) Stop() {
	fmt.Println("🛑 GameDeveloperAgent stopped")
}

func (g *GameDeveloperAgent) Name() string {
	return "GameDeveloperAgent"
}

func (g *GameDeveloperAgent) DevGame(data map[string]interface{}) {
	fmt.Println("[GameDeveloperAgent] Game development action:", data)
}
