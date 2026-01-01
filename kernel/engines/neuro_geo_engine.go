package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroGeoEngine struct {
	EventBus *core.EventBus
}

func NewNeuroGeoEngine(bus *core.EventBus) *NeuroGeoEngine {
	return &NeuroGeoEngine{
		EventBus: bus,
	}
}

func (n *NeuroGeoEngine) Start() {
	fmt.Println("🚀 NeuroGeoEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("geo:analyze", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroGeoEngine] Geo Event:", event)
			n.AnalyzeGeo(event)
		}
	}()
}

func (n *NeuroGeoEngine) Stop() {
	fmt.Println("🛑 NeuroGeoEngine stopped")
}

func (n *NeuroGeoEngine) Name() string {
	return "NeuroGeoEngine"
}

func (n *NeuroGeoEngine) AnalyzeGeo(data map[string]interface{}) {
	fmt.Println("[NeuroGeoEngine] Geo data analyzed:", data)
}
