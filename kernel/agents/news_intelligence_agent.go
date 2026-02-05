// kernel/agents/news_intelligence_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types to break import cycle
)

type NewsIntelligenceAgent struct {
	EventBus *types.EventBus
}

func NewNewsIntelligenceAgent(bus *types.EventBus) *NewsIntelligenceAgent {
	return &NewsIntelligenceAgent{
		EventBus: bus,
	}
}

func (n *NewsIntelligenceAgent) Start() {
	fmt.Println("🚀 NewsIntelligenceAgent started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("news:scan", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NewsIntelligenceAgent] Scanning News:", event)
			n.AnalyzeNews(event)
		}
	}()
}

func (n *NewsIntelligenceAgent) Stop() {
	fmt.Println("🛑 NewsIntelligenceAgent stopped")
}

func (n *NewsIntelligenceAgent) Name() string {
	return "NewsIntelligenceAgent"
}

func (n *NewsIntelligenceAgent) AnalyzeNews(data map[string]interface{}) {
	fmt.Println("[NewsIntelligenceAgent] News intelligence processed:", data)
}
