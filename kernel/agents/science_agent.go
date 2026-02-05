package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

type ScienceAgent struct {
	EventBus *types.EventBus
}

func NewScienceAgent(bus *types.EventBus) *ScienceAgent {
	return &ScienceAgent{
		EventBus: bus,
	}
}

func (s *ScienceAgent) Start() {
	fmt.Println("🚀 ScienceAgent started")

	ch := make(chan types.Event)
	s.EventBus.Subscribe("science:experiment", ch)

	go func() {
		for event := range ch {
			fmt.Println("[ScienceAgent] Science Event:", event.Payload)
			s.RunExperiment(event.Payload)
		}
	}()
}

func (s *ScienceAgent) Stop() {
	fmt.Println("🛑 ScienceAgent stopped")
}

func (s *ScienceAgent) Name() string {
	return "ScienceAgent"
}

func (s *ScienceAgent) RunExperiment(data map[string]interface{}) {
	fmt.Println("[ScienceAgent] Running experiment:", data)
}
