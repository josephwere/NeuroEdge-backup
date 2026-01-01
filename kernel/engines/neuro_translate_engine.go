package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroTranslateEngine struct {
	EventBus *core.EventBus
}

func NewNeuroTranslateEngine(bus *core.EventBus) *NeuroTranslateEngine {
	return &NeuroTranslateEngine{
		EventBus: bus,
	}
}

func (n *NeuroTranslateEngine) Start() {
	fmt.Println("🚀 NeuroTranslateEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("translate:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroTranslateEngine] Translate Event:", event)
			n.Translate(event)
		}
	}()
}

func (n *NeuroTranslateEngine) Stop() {
	fmt.Println("🛑 NeuroTranslateEngine stopped")
}

func (n *NeuroTranslateEngine) Name() string {
	return "NeuroTranslateEngine"
}

func (n *NeuroTranslateEngine) Translate(data map[string]interface{}) {
	fmt.Println("[NeuroTranslateEngine] Translation completed:", data)
}
