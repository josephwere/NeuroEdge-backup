// kernel/agents/satellite_link_agent.go
package agents

import (
	"fmt"

	"neuroedge/kernel/types"
)

// SatelliteLinkAgent manages satellite-to-ground link updates
type SatelliteLinkAgent struct {
	EventBus *types.EventBus
}

func NewSatelliteLinkAgent(bus *types.EventBus) *SatelliteLinkAgent {
	return &SatelliteLinkAgent{
		EventBus: bus,
	}
}

func (s *SatelliteLinkAgent) Start() {
	fmt.Println("🛰️ SatelliteLinkAgent started")

	ch := make(chan map[string]interface{})
	s.EventBus.Subscribe("mesh:satellite:update", ch)

	go func() {
		for event := range ch {
			fmt.Println("[SatelliteLinkAgent] Satellite Link Event:", event)
			s.UpdateLink(event)
		}
	}()
}

func (s *SatelliteLinkAgent) Stop() {
	fmt.Println("🛑 SatelliteLinkAgent stopped")
}

func (s *SatelliteLinkAgent) Name() string {
	return "SatelliteLinkAgent"
}

func (s *SatelliteLinkAgent) UpdateLink(data map[string]interface{}) {
	fmt.Println("[SatelliteLinkAgent] Link updated:", data)
}
