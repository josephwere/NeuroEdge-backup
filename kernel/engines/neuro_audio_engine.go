package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroAudioEngine struct {
	EventBus *core.EventBus
}

func NewNeuroAudioEngine(bus *core.EventBus) *NeuroAudioEngine {
	return &NeuroAudioEngine{
		EventBus: bus,
	}
}

func (n *NeuroAudioEngine) Start() {
	fmt.Println("🚀 NeuroAudioEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("audio:request", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroAudioEngine] Audio Event:", event)
			n.ProcessAudio(event)
		}
	}()
}

func (n *NeuroAudioEngine) Stop() {
	fmt.Println("🛑 NeuroAudioEngine stopped")
}

func (n *NeuroAudioEngine) Name() string {
	return "NeuroAudioEngine"
}

func (n *NeuroAudioEngine) ProcessAudio(data map[string]interface{}) {
	fmt.Println("[NeuroAudioEngine] Audio processed:", data)
}
