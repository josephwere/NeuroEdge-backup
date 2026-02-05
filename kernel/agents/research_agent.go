package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

// ResearchAgent analyzes research data
type ResearchAgent struct {
	EventBus *types.EventBus
}

func NewResearchAgent(bus *types.EventBus) *ResearchAgent {
	return &ResearchAgent{
		EventBus: bus,
	}
}

func (r *ResearchAgent) Start() {
	fmt.Println("🚀 ResearchAgent started")
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("research:new", ch)

	go func() {
		for event := range ch {
			fmt.Println("[ResearchAgent] Research Event:", event)
			r.AnalyzeResearch(event)
		}
	}()
}

func (r *ResearchAgent) Stop() {
	fmt.Println("🛑 ResearchAgent stopped")
}

func (r *ResearchAgent) Name() string {
	return "ResearchAgent"
}

func (r *ResearchAgent) AnalyzeResearch(data map[string]interface{}) {
	fmt.Println("[ResearchAgent] Analyzing research data:", data)
}
