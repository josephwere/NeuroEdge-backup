package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroMathEngine struct {
	EventBus *core.EventBus
}

func NewNeuroMathEngine(bus *core.EventBus) *NeuroMathEngine {
	return &NeuroMathEngine{
		EventBus: bus,
	}
}

func (n *NeuroMathEngine) Start() {
	fmt.Println("🚀 NeuroMathEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("math:compute", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroMathEngine] Math Event:", event)
			n.Compute(event)
		}
	}()
}

func (n *NeuroMathEngine) Stop() {
	fmt.Println("🛑 NeuroMathEngine stopped")
}

func (n *NeuroMathEngine) Name() string {
	return "NeuroMathEngine"
}

func (n *NeuroMathEngine) Compute(data map[string]interface{}) {
	fmt.Println("[NeuroMathEngine] Computation result:", data)
}
