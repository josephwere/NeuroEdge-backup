package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type SatelliteLinkAgent struct {
	EventBus *core.EventBus
}

func NewSatelliteLinkAgent(bus *core.EventBus) *SatelliteLinkAgent {
	return &SatelliteLinkAgent{
		EventBus: bus,
	}
}

func (s *SatelliteLinkAgent) Start() {
	fmt.Println("🚀 SatelliteLinkAgent started")
	ch := make(chan map[string]interface{})
	s.EventBus.Subscribe("satellite:link", ch)
	go func() {
		for event := range ch {
			fmt.Println("[SatelliteLinkAgent] Satellite Event:", event)
			s.ManageLink(event)
		}
	}()
}

func (s *SatelliteLinkAgent) Stop() {
	fmt.Println("🛑 SatelliteLinkAgent stopped")
}

func (s *SatelliteLinkAgent) Name() string {
	return "SatelliteLinkAgent"
}

func (s *SatelliteLinkAgent) ManageLink(data map[string]interface{}) {
	fmt.Println("[SatelliteLinkAgent] Satellite link managed:", data)
}
