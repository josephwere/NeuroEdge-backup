package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type GlobalMeshAgent struct {
	EventBus *core.EventBus
}

func NewGlobalMeshAgent(bus *core.EventBus) *GlobalMeshAgent {
	agent := &GlobalMeshAgent{
		EventBus: bus,
	}
	return agent
}

func (g *GlobalMeshAgent) Start() {
	fmt.Println("🚀 GlobalMeshAgent started")
	// Example: Subscribe to mesh events
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

// Example: Function to route messages
func (g *GlobalMeshAgent) RouteMessage(nodeID string, payload map[string]interface{}) {
	fmt.Printf("[GlobalMeshAgent] Routing to node %s: %v\n", nodeID, payload)
}
