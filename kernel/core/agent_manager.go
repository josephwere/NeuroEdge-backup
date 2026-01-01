package core

import "fmt"

type Agent interface {
	Start()
	Stop()
	Name() string
}

type AgentManager struct {
	agents map[string]Agent
}

func NewAgentManager() *AgentManager {
	return &AgentManager{
		agents: make(map[string]Agent),
	}
}

func (am *AgentManager) Register(name string, agent Agent) {
	am.agents[name] = agent
	fmt.Println("✅ Registered Agent:", name)
}

func (am *AgentManager) StartAll() {
	for _, agent := range am.agents {
		agent.Start()
	}
}

func (am *AgentManager) StopAll() {
	for _, agent := range am.agents {
		agent.Stop()
	}
}
