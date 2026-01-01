package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type GlobalMeshAgent struct {
	EventBus *core.EventBus
}

func NewGlobalMeshAgent(bus *core.EventBus) *GlobalMeshAgent {
	return &GlobalMeshAgent{
		EventBus: bus,
	}
}

func (g *GlobalMeshAgent) Start() {
	fmt.Println("🚀 GlobalMeshAgent started")
}

func (g *GlobalMeshAgent) Stop() {
	fmt.Println("🛑 GlobalMeshAgent stopped")
}

func (g *GlobalMeshAgent) Name() string {
	return "GlobalMeshAgent"
}
