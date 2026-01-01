package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type RouterMeshAgent struct {
	EventBus *core.EventBus
}

func NewRouterMeshAgent(bus *core.EventBus) *RouterMeshAgent {
	return &RouterMeshAgent{
		EventBus: bus,
	}
}

func (r *RouterMeshAgent) Start() {
	fmt.Println("🚀 RouterMeshAgent started")
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("mesh:router:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[RouterMeshAgent] Router Mesh Event:", event)
			r.UpdateMesh(event)
		}
	}()
}

func (r *RouterMeshAgent) Stop() {
	fmt.Println("🛑 RouterMeshAgent stopped")
}

func (r *RouterMeshAgent) Name() string {
	return "RouterMeshAgent"
}

func (r *RouterMeshAgent) UpdateMesh(data map[string]interface{}) {
	fmt.Println("[RouterMeshAgent] Mesh updated:", data)
}
