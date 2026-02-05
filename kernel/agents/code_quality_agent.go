// kernel/agents/code_quality_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type CodeQualityAgent struct {
	EventBus *types.EventBus
}

func NewCodeQualityAgent(bus *types.EventBus) *CodeQualityAgent {
	return &CodeQualityAgent{
		EventBus: bus,
	}
}

func (c *CodeQualityAgent) Start() {
	fmt.Println("🚀 CodeQualityAgent started")
	ch := make(chan map[string]interface{})
	c.EventBus.Subscribe("code:review", ch)
	go func() {
		for event := range ch {
			fmt.Println("[CodeQualityAgent] Code Review Event:", event)
			c.ReviewCode(event)
		}
	}()
}

func (c *CodeQualityAgent) Stop() {
	fmt.Println("🛑 CodeQualityAgent stopped")
}

func (c *CodeQualityAgent) Name() string {
	return "CodeQualityAgent"
}

func (c *CodeQualityAgent) ReviewCode(data map[string]interface{}) {
	fmt.Println("[CodeQualityAgent] Code metrics:", data)
}
