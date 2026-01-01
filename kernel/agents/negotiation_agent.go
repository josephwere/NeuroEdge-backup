package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NegotiationAgent struct {
	EventBus *core.EventBus
}

func NewNegotiationAgent(bus *core.EventBus) *NegotiationAgent {
	return &NegotiationAgent{
		EventBus: bus,
	}
}

func (n *NegotiationAgent) Start() {
	fmt.Println("🚀 NegotiationAgent started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("negotiation:event", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NegotiationAgent] Negotiation Event:", event)
			n.Negotiate(event)
		}
	}()
}

func (n *NegotiationAgent) Stop() {
	fmt.Println("🛑 NegotiationAgent stopped")
}

func (n *NegotiationAgent) Name() string {
	return "NegotiationAgent"
}

func (n *NegotiationAgent) Negotiate(data map[string]interface{}) {
	fmt.Println("[NegotiationAgent] Negotiation process:", data)
}
