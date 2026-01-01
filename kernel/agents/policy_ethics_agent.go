package agents

import (
	"fmt"
	"time"

	"NeuroEdge/kernel/core"
)

type PolicyEthicsAgent struct {
	name string
}

func NewPolicyEthicsAgent() *PolicyEthicsAgent {
	return &PolicyEthicsAgent{name: "PolicyEthicsAgent"}
}

func (a *PolicyEthicsAgent) Name() string {
	return a.name
}

func (a *PolicyEthicsAgent) Start() {
	core.Info(a.Name() + " starting...")
	ch := make(chan core.Event)
	core.GetKernel().EventBus.Subscribe("DecisionEvent", ch)

	go func() {
		for evt := range ch {
			core.Info(fmt.Sprintf("%s reviewing decision: %v", a.Name(), evt.Data))
			time.Sleep(300 * time.Millisecond)
			core.GetKernel().EventBus.Publish(core.Event{
				Name: "DecisionApproved",
				Data: fmt.Sprintf("%s approved decision", a.Name()),
			})
		}
	}()
}

func (a *PolicyEthicsAgent) Stop() {
	core.Info(a.Name() + " stopped.")
}
