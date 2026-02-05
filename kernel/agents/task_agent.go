// kernel/agents/task_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/types"
)

type TaskAgent struct {
	EventBus types.EventBus
	Name     string
}

func NewTaskAgent(bus types.EventBus) *TaskAgent {
	return &TaskAgent{
		EventBus: bus,
		Name:     "TaskAgent",
	}
}

func (t *TaskAgent) Start() {
	fmt.Printf("🚀 %s ready to execute tasks...\n", t.Name)

	ch := make(chan map[string]interface{})
	t.EventBus.Subscribe("task:execute", ch)

	go func() {
		for payload := range ch {
			task, ok := payload["task"].(string)
			if !ok {
				fmt.Printf("[%s] invalid task payload: %v\n", t.Name, payload)
				continue
			}
			t.Execute(task)
		}
	}()
}

func (t *TaskAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", t.Name)
}

func (t *TaskAgent) NameFunc() string {
	return t.Name
}

func (t *TaskAgent) Execute(task string) {
	fmt.Printf("[%s] executing task: %s\n", t.Name, task)

	// Example: emit result event
	t.EventBus.Publish("task:result", map[string]interface{}{
		"agent": t.Name,
		"task":  task,
		"status": "completed",
	})
}
