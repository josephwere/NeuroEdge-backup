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

// NewSatelliteLinkAgent creates a new SatelliteLinkAgent instance
func NewSatelliteLinkAgent(bus *core.EventBus) *SatelliteLinkAgent {
	return &SatelliteLinkAgent{
		EventBus: bus,
		Name:     "SatelliteLinkAgent",
	}
}

// Start subscribes to satellite link events
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

// Stop gracefully stops the agent
func (s *SatelliteLinkAgent) Stop() {
	fmt.Printf("🛑 %s stopped\n", s.Name)
}

// NameFunc returns the agent's name
func (s *SatelliteLinkAgent) NameFunc() string {
	return s.Name
}

// ManageLink processes satellite link updates
func (s *SatelliteLinkAgent) ManageLink(data map[string]interface{}) {
	fmt.Printf("[%s] Satellite link managed: %v\n", s.Name, data)
}
