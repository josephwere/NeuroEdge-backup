package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type MedicalImagingAgent struct {
	EventBus *core.EventBus
}

func NewMedicalImagingAgent(bus *core.EventBus) *MedicalImagingAgent {
	return &MedicalImagingAgent{
		EventBus: bus,
	}
}

func (m *MedicalImagingAgent) Start() {
	fmt.Println("🚀 MedicalImagingAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("medical:image", ch)
	go func() {
		for event := range ch {
			fmt.Println("[MedicalImagingAgent] Imaging Event:", event)
			m.AnalyzeImage(event)
		}
	}()
}

func (m *MedicalImagingAgent) Stop() {
	fmt.Println("🛑 MedicalImagingAgent stopped")
}

func (m *MedicalImagingAgent) Name() string {
	return "MedicalImagingAgent"
}

func (m *MedicalImagingAgent) AnalyzeImage(data map[string]interface{}) {
	fmt.Println("[MedicalImagingAgent] Analyzing medical image:", data)
}
