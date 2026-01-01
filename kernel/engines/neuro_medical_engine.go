package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroMedicalEngine struct {
	EventBus *core.EventBus
}

func NewNeuroMedicalEngine(bus *core.EventBus) *NeuroMedicalEngine {
	return &NeuroMedicalEngine{
		EventBus: bus,
	}
}

func (n *NeuroMedicalEngine) Start() {
	fmt.Println("🚀 NeuroMedicalEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("medical:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroMedicalEngine] Medical Event:", event)
			n.AnalyzeMedical(event)
		}
	}()
}

func (n *NeuroMedicalEngine) Stop() {
	fmt.Println("🛑 NeuroMedicalEngine stopped")
}

func (n *NeuroMedicalEngine) Name() string {
	return "NeuroMedicalEngine"
}

func (n *NeuroMedicalEngine) AnalyzeMedical(data map[string]interface{}) {
	fmt.Println("[NeuroMedicalEngine] Medical analysis completed:", data)
}
