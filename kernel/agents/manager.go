package agents

import (
    "fmt"
    "neuroedge/kernel/events"
)

type Manager struct {
    EventBus *events.EventBus
    Agents   map[string]interface{}
}

func NewManager(bus *events.EventBus) *Manager {
    return &Manager{
        EventBus: bus,
        Agents:   make(map[string]interface{}),
    }
}

// Register agent placeholder
func (m *Manager) Register(name string, agent interface{}) {
    m.Agents[name] = agent
    fmt.Printf("🧩 Agent registered: %s\n", name)
}
