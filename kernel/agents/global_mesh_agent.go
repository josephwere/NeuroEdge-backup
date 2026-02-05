// kernel/agents/global_mesh_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types instead of core
)

type GlobalMeshAgent struct {
	EventBus *types.EventBus
}

func NewGlobalMeshAgent(bus *types.EventBus) *GlobalMeshAgent {
	agent := &GlobalMeshAgent{
		EventBus: bus,
	}
	return agent
}

func (g *GlobalMeshAgent) Start() {
	fmt.Println("🚀 GlobalMeshAgent started")
	ch := make(chan map[string]interface{})
	g.EventBus.Subscribe("mesh:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[GlobalMeshAgent] Mesh Update Event:", event)
		}
	}()
}

func (g *GlobalMeshAgent) Stop() {
	fmt.Println("🛑 GlobalMeshAgent stopped")
}

func (g *GlobalMeshAgent) Name() string {
	return "GlobalMeshAgent"
}

// Route messages to nodes
func (g *GlobalMeshAgent) RouteMessage(nodeID string, payload map[string]interface{}) {
	fmt.Printf("[GlobalMeshAgent] Routing to node %s: %v\n", nodeID, payload)
}
