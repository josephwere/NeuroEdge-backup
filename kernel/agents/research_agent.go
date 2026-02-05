package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// ResearchAgent analyzes research data
type ResearchAgent struct {
	EventBus *core.EventBus
	Name     string
}

func NewResearchAgent(bus *core.EventBus) *ResearchAgent {
	return &ResearchAgent{
		EventBus: bus,
		Name:     "ResearchAgent",
	}
}

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

func (r *ResearchAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

func (r *ResearchAgent) NameFunc() string {
	return r.Name
}

func (r *ResearchAgent) AnalyzeResearch(data map[string]interface{}) {
	fmt.Printf("[%s] Analyzing research data: %v\n", r.Name, data)
}
