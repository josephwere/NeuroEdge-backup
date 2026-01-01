package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroEdgeMeshEngine struct {
	EventBus *core.EventBus
}

func NewNeuroEdgeMeshEngine(bus *core.EventBus) *NeuroEdgeMeshEngine {
	return &NeuroEdgeMeshEngine{
		EventBus: bus,
	}
}

func (n *NeuroEdgeMeshEngine) Start() {
	fmt.Println("🚀 NeuroEdgeMeshEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("mesh:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroEdgeMeshEngine] Mesh Event:", event)
			n.ManageMesh(event)
		}
	}()
}

func (n *NeuroEdgeMeshEngine) Stop() {
	fmt.Println("🛑 NeuroEdgeMeshEngine stopped")
}

func (n *NeuroEdgeMeshEngine) Name() string {
	return "NeuroEdgeMeshEngine"
}

func (n *NeuroEdgeMeshEngine) ManageMesh(data map[string]interface{}) {
	fmt.Println("[NeuroEdgeMeshEngine] Mesh managed:", data)
}
