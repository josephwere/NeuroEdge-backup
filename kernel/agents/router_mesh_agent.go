// kernel/agents/router_mesh_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// RouterMeshAgent manages router mesh updates
type RouterMeshAgent struct {
	EventBus *core.EventBus
	Name     string
}

func NewRouterMeshAgent(bus *core.EventBus) *RouterMeshAgent {
	return &RouterMeshAgent{
		EventBus: bus,
		Name:     "RouterMeshAgent",
	}
}

func (r *RouterMeshAgent) Start() {
	fmt.Printf("🚀 %s started\n", r.Name)
	ch := make(chan map[string]interface{})
	r.EventBus.Subscribe("mesh:router:update", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Router Mesh Event: %v\n", r.Name, event)
			r.UpdateMesh(event)
		}
	}()
}

func (r *RouterMeshAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", r.Name)
}

func (r *RouterMeshAgent) NameFunc() string {
	return r.Name
}

func (r *RouterMeshAgent) UpdateMesh(data map[string]interface{}) {
	fmt.Printf("[%s] Mesh updated: %v\n", r.Name, data)
}
