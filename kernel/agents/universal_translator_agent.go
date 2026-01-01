package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type UniversalTranslatorAgent struct {
	EventBus *core.EventBus
}

func NewUniversalTranslatorAgent(bus *core.EventBus) *UniversalTranslatorAgent {
	return &UniversalTranslatorAgent{
		EventBus: bus,
	}
}

func (u *UniversalTranslatorAgent) Start() {
	fmt.Println("🚀 UniversalTranslatorAgent started")
	ch := make(chan map[string]interface{})
	u.EventBus.Subscribe("translate:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[UniversalTranslatorAgent] Translation Event:", event)
			u.Translate(event)
		}
	}()
}

func (u *UniversalTranslatorAgent) Stop() {
	fmt.Println("🛑 UniversalTranslatorAgent stopped")
}

func (u *UniversalTranslatorAgent) Name() string {
	return "UniversalTranslatorAgent"
}

func (u *UniversalTranslatorAgent) Translate(data map[string]interface{}) {
	fmt.Println("[UniversalTranslatorAgent] Translating:", data)
}
