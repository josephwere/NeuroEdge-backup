// kernel/agents/research_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// ResearchAgent handles research data analysis and insights
type ResearchAgent struct {
	EventBus *core.EventBus
	Name     string
}

// NewResearchAgent creates a new ResearchAgent instance
func NewResearchAgent(bus *core.EventBus) *ResearchAgent {
	return &ResearchAgent{
		EventBus: bus,
		Name:     "ResearchAgent",
	}
}

// Start subscribes to research events and begins processing
func (r *ResearchAgent) Start() {
	fmt.Printf("🚀 %s started\n", r.Name)

	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("research:new", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Research Event: %v\n", r.Name, event)
			r.AnalyzeResearch(event)
		}
	}()
}

// Stop gracefully stops the agent
func (r *ResearchAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

// Name returns the agent name
func (r *ResearchAgent) NameFunc() string {
	return r.Name
}

// AnalyzeResearch processes the incoming research data
func (r *ResearchAgent) AnalyzeResearch(data map[string]interface{}) {
	fmt.Printf("[%s] Analyzing research data: %v\n", r.Name, data)
}
