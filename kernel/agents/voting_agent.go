package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type VotingAgent struct {
	EventBus *core.EventBus
}

func NewVotingAgent(bus *core.EventBus) *VotingAgent {
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
