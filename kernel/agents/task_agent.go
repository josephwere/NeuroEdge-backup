package agents

import (
	"fmt"
	"NeuroEdge/kernel/core"
)

type TaskAgent struct {
	Name string
}

func NewTaskAgent() *TaskAgent {
	return &TaskAgent{
		Name: "TaskAgent",
	}
}

func (t *TaskAgent) Start() {
	fmt.Printf("[%s] ready to execute tasks...\n", t.Name)
	core.EventBus.Subscribe("task:execute", t.HandleEvent)
}

func (t *TaskAgent) HandleEvent(event string, payload interface{}) {
	task := fmt.Sprintf("%v", payload)
	core.ExecuteWithGuard(t.Name, task, t.Execute)
}

func (t *TaskAgent) Execute(task string) {
	fmt.Printf("[%s] executing task: %s\n", t.Name, task)
	// TODO: actual execution logic
}

func (t *TaskAgent) GetName() string {
	return t.Name
}
