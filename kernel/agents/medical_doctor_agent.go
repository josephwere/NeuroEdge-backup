// kernel/agents/medical_doctor_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types to break core dependency
)

type MedicalDoctorAgent struct {
	EventBus *types.EventBus
}

func NewMedicalDoctorAgent(bus *types.EventBus) *MedicalDoctorAgent {
	return &MedicalDoctorAgent{
		EventBus: bus,
	}
}

func (m *MedicalDoctorAgent) Start() {
	fmt.Println("🚀 MedicalDoctorAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("health:patient_data", ch)
	go func() {
		for event := range ch {
			fmt.Println("[MedicalDoctorAgent] Patient Data Received:", event)
			m.AnalyzePatient(event)
		}
	}()
}

func (m *MedicalDoctorAgent) Stop() {
	fmt.Println("🛑 MedicalDoctorAgent stopped")
}

func (m *MedicalDoctorAgent) Name() string {
	return "MedicalDoctorAgent"
}

func (m *MedicalDoctorAgent) AnalyzePatient(data map[string]interface{}) {
	fmt.Println("[MedicalDoctorAgent] Analyzing patient data:", data)
}
