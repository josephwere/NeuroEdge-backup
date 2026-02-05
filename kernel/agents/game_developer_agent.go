// kernel/agents/game_developer_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type GameDeveloperAgent struct {
	EventBus *types.EventBus
}

func NewGameDeveloperAgent(bus *types.EventBus) *GameDeveloperAgent {
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
