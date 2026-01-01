package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type ScienceAgent struct {
	EventBus *core.EventBus
}

func NewScienceAgent(bus *core.EventBus) *ScienceAgent {
	return &ScienceAgent{
		EventBus: bus,
	}
}

func (s *ScienceAgent) Start() {
	fmt.Println("🚀 ScienceAgent started")
	ch := make(chan map[string]interface{})
	s.EventBus.Subscribe("science:experiment", ch)
	go func() {
		for event := range ch {
			fmt.Println("[ScienceAgent] Science Event:", event)
			s.RunExperiment(event)
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
