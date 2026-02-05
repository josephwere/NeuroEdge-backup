// kernel/agents/voting_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types" // ✅ switched from core to types
)

type VotingAgent struct {
	EventBus *types.EventBus
}

func NewVotingAgent(bus *types.EventBus) *VotingAgent {
	return &VotingAgent{
		EventBus: bus,
	}
}

func (v *VotingAgent) Start() {
	fmt.Println("🚀 VotingAgent started")

	ch := make(chan map[string]interface{})
	v.EventBus.Subscribe("voting:update", ch)

	go func() {
		for event := range ch {
			fmt.Println("[VotingAgent] Voting Event:", event)
			v.ManageVoting(event)
		}
	}()
}

func (v *VotingAgent) Stop() {
	fmt.Println("🛑 VotingAgent stopped")
}

func (v *VotingAgent) Name() string {
	return "VotingAgent"
}

func (v *VotingAgent) ManageVoting(data map[string]interface{}) {
	fmt.Println("[VotingAgent] Voting processed:", data)
}
