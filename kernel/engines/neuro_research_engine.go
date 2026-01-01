package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroResearchEngine struct {
	EventBus *core.EventBus
}

func NewNeuroResearchEngine(bus *core.EventBus) *NeuroResearchEngine {
	return &NeuroResearchEngine{
		EventBus: bus,
	}
}

func (n *NeuroResearchEngine) Start() {
	fmt.Println("🚀 NeuroResearchEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("research:analyze", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroResearchEngine] Research Event:", event)
			n.PerformResearch(event)
		}
	}()
}

func (n *NeuroResearchEngine) Stop() {
	fmt.Println("🛑 NeuroResearchEngine stopped")
}

func (n *NeuroResearchEngine) Name() string {
	return "NeuroResearchEngine"
}

func (n *NeuroResearchEngine) PerformResearch(data map[string]interface{}) {
	fmt.Println("[NeuroResearchEngine] Research completed:", data)
}
