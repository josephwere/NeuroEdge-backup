package agents

import (
	"fmt"
	"time"

	"NeuroEdge/kernel/core"
)

type SecurityAgent struct {
	name string
}

func NewSecurityAgent() *SecurityAgent {
	return &SecurityAgent{name: "SecurityAgent"}
}

func (a *SecurityAgent) Name() string {
	return a.name
}

func (a *SecurityAgent) Start() {
	core.Info(a.Name() + " starting...")
	ch := make(chan core.Event)
	core.GetKernel().EventBus.Subscribe("SecurityAlert", ch)

	go func() {
		for evt := range ch {
			core.Info(fmt.Sprintf("%s analyzing alert: %v", a.Name(), evt.Data))
			// Handle alert
			time.Sleep(500 * time.Millisecond)
			core.GetKernel().EventBus.Publish(core.Event{
				Name: "SecurityResponse",
				Data: fmt.Sprintf("%s mitigated threat", a.Name()),
			})
		}
	}()
}

func (a *SecurityAgent) Stop() {
	core.Info(a.Name() + " stopped.")
}
