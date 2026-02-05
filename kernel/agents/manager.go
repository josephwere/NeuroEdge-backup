// kernel/agents/manager.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // use types for EventBus
)

type Manager struct {
	EventBus *types.EventBus
	Agents   map[string]interface{}
}

func NewManager(bus *types.EventBus) *Manager {
	return &Manager{
		EventBus: bus,
		Agents:   make(map[string]interface{}),
	}
}

// Register an agent
func (m *Manager) Register(name string, agent interface{}) {
	m.Agents[name] = agent
	fmt.Printf("🧩 Agent registered: %s\n", name)
}
