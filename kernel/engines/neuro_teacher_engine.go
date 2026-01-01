package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroTeacherEngine struct {
	EventBus *core.EventBus
}

func NewNeuroTeacherEngine(bus *core.EventBus) *NeuroTeacherEngine {
	return &NeuroTeacherEngine{
		EventBus: bus,
	}
}

func (n *NeuroTeacherEngine) Start() {
	fmt.Println("🚀 NeuroTeacherEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("teach:lesson", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroTeacherEngine] Teaching Event:", event)
			n.LearnAndTeach(event)
		}
	}()
}

func (n *NeuroTeacherEngine) Stop() {
	fmt.Println("🛑 NeuroTeacherEngine stopped")
}

func (n *NeuroTeacherEngine) Name() string {
	return "NeuroTeacherEngine"
}

func (n *NeuroTeacherEngine) LearnAndTeach(data map[string]interface{}) {
	fmt.Println("[NeuroTeacherEngine] Lesson processed:", data)
}
