package agents

import (
	"fmt"
	"time"

	"NeuroEdge/kernel/core"
)

type TaskAgent struct {
	name string
}

func NewTaskAgent() *TaskAgent {
	return &TaskAgent{name: "TaskAgent"}
}

func (a *TaskAgent) Name() string {
	return a.name
}

func (a *TaskAgent) Start() {
	core.Info(a.Name() + " starting...")
	ch := make(chan core.Event)
	core.GetKernel().EventBus.Subscribe("TaskEvent", ch)

	go func() {
		for evt := range ch {
			core.Info(fmt.Sprintf("%s received task: %v", a.Name(), evt.Data))
			// Process task
			time.Sleep(1 * time.Second)
			// Emit result
			core.GetKernel().EventBus.Publish(core.Event{
				Name: "TaskResult",
				Data: fmt.Sprintf("%s completed task", a.Name()),
			})
		}
	}()
}

func (a *TaskAgent) Stop() {
	core.Info(a.Name() + " stopped.")
}
