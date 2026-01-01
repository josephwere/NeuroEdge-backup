package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type Neuro3DEngine struct {
	EventBus *core.EventBus
}

func NewNeuro3DEngine(bus *core.EventBus) *Neuro3DEngine {
	return &Neuro3DEngine{
		EventBus: bus,
	}
}

func (n *Neuro3DEngine) Start() {
	fmt.Println("🚀 Neuro3DEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("3d:render", ch)
	go func() {
		for event := range ch {
			fmt.Println("[Neuro3DEngine] 3D Rendering Event:", event)
			n.Render3D(event)
		}
	}()
}

func (n *Neuro3DEngine) Stop() {
	fmt.Println("🛑 Neuro3DEngine stopped")
}

func (n *Neuro3DEngine) Name() string {
	return "Neuro3DEngine"
}

func (n *Neuro3DEngine) Render3D(data map[string]interface{}) {
	fmt.Println("[Neuro3DEngine] 3D Model rendered:", data)
}
