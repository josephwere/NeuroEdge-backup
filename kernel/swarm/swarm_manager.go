package swarm

import (
	"kernel/swarm/coordinator"
	"kernel/swarm/agent_factory"
)

type SwarmManager struct {
	Coordinator *coordinator.SwarmCoordinator
	Factory     *agent_factory.AgentFactory
}

func NewSwarmManager() *SwarmManager {
	return &SwarmManager{
		Coordinator: coordinator.NewSwarmCoordinator(),
		Factory:     agent_factory.NewAgentFactory(),
	}
}

func (s *SwarmManager) Start() {
	s.Coordinator.Start()
}
