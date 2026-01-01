package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type CodeQualityAgent struct {
	EventBus *core.EventBus
}

func NewCodeQualityAgent(bus *core.EventBus) *CodeQualityAgent {
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
