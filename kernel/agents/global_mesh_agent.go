package agents

import (
    "fmt"
    "neuroedge/kernel/events"
)

type GlobalMeshAgent struct {
    EventBus *events.EventBus
    NameStr  string
}

func NewGlobalMeshAgent(bus *events.EventBus) *GlobalMeshAgent {
    agent := &GlobalMeshAgent{
        EventBus: bus,
        NameStr:  "GlobalMeshAgent",
    }
    // Subscribe to example events
    ch := make(chan map[string]interface{})
    bus.Subscribe("mesh:update", ch)
    go agent.Listen(ch)
    return agent
}

func (g *GlobalMeshAgent) Listen(ch chan map[string]interface{}) {
    for data := range ch {
        fmt.Println("🌐 GlobalMeshAgent received event:", data)
    }
}

func (g *GlobalMeshAgent) Start() {
    fmt.Println("🚀 GlobalMeshAgent started")
}

func (g *GlobalMeshAgent) Stop() {
    fmt.Println("🛑 GlobalMeshAgent stopped")
}

func (g *GlobalMeshAgent) Name() string {
    return g.NameStr
}
