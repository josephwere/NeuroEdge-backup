package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroSecurityEngine struct {
	EventBus *core.EventBus
}

func NewNeuroSecurityEngine(bus *core.EventBus) *NeuroSecurityEngine {
	return &NeuroSecurityEngine{
		EventBus: bus,
	}
}

func (n *NeuroSecurityEngine) Start() {
	fmt.Println("🚀 NeuroSecurityEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("security:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroSecurityEngine] Security Event:", event)
			n.HandleSecurity(event)
		}
	}()
}

func (n *NeuroSecurityEngine) Stop() {
	fmt.Println("🛑 NeuroSecurityEngine stopped")
}

func (n *NeuroSecurityEngine) Name() string {
	return "NeuroSecurityEngine"
}

func (n *NeuroSecurityEngine) HandleSecurity(data map[string]interface{}) {
	fmt.Println("[NeuroSecurityEngine] Security processed:", data)
}
