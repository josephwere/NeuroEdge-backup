// kernel/agents/satellite_link_agent.go
package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

// SatelliteLinkAgent manages satellite link events
type SatelliteLinkAgent struct {
	EventBus *core.EventBus
	Name     string
}

func NewSatelliteLinkAgent(bus *core.EventBus) *SatelliteLinkAgent {
	return &SatelliteLinkAgent{
		EventBus: bus,
		Name:     "SatelliteLinkAgent",
	}
}

func (s *SatelliteLinkAgent) Start() {
	fmt.Printf("🚀 %s started\n", s.Name)
	ch := make(chan map[string]interface{})
	s.EventBus.Subscribe("satellite:link", ch)

	go func() {
		for event := range ch {
			fmt.Printf("[%s] Satellite Event: %v\n", s.Name, event)
			s.ManageLink(event)
		}
	}()
}

func (s *SatelliteLinkAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", s.Name)
}

func (s *SatelliteLinkAgent) NameFunc() string {
	return s.Name
}

func (s *SatelliteLinkAgent) ManageLink(data map[string]interface{}) {
	fmt.Printf("[%s] Satellite link managed: %v\n", s.Name, data)
}
