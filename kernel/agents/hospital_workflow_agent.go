// kernel/agents/hospital_workflow_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type HospitalWorkflowAgent struct {
	EventBus *types.EventBus
}

func NewHospitalWorkflowAgent(bus *types.EventBus) *HospitalWorkflowAgent {
	return &HospitalWorkflowAgent{
		EventBus: bus,
	}
}

func (h *HospitalWorkflowAgent) Start() {
	fmt.Println("🚀 HospitalWorkflowAgent started")
	ch := make(chan map[string]interface{})
	h.EventBus.Subscribe("hospital:workflow", ch)
	go func() {
		for event := range ch {
			fmt.Println("[HospitalWorkflowAgent] Workflow Event:", event)
			h.ManageWorkflow(event)
		}
	}()
}

func (h *HospitalWorkflowAgent) Stop() {
	fmt.Println("🛑 HospitalWorkflowAgent stopped")
}

func (h *HospitalWorkflowAgent) Name() string {
	return "HospitalWorkflowAgent"
}

func (h *HospitalWorkflowAgent) ManageWorkflow(data map[string]interface{}) {
	fmt.Println("[HospitalWorkflowAgent] Managing hospital workflow:", data)
}
