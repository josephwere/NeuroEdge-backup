package engines

import (
	"fmt"
	"neuroedge/kernel/core"
)

type NeuroSensorsEngine struct {
	EventBus *core.EventBus
}

func NewNeuroSensorsEngine(bus *core.EventBus) *NeuroSensorsEngine {
	return &NeuroSensorsEngine{
		EventBus: bus,
	}
}

func (n *NeuroSensorsEngine) Start() {
	fmt.Println("🚀 NeuroSensorsEngine started")
	ch := make(chan map[string]interface{})
	n.EventBus.Subscribe("sensor:data", ch)
	go func() {
		for event := range ch {
			fmt.Println("[NeuroSensorsEngine] Sensor Data Event:", event)
			n.ProcessSensorData(event)
		}
	}()
}

func (n *NeuroSensorsEngine) Stop() {
	fmt.Println("🛑 NeuroSensorsEngine stopped")
}

func (n *NeuroSensorsEngine) Name() string {
	return "NeuroSensorsEngine"
}

func (n *NeuroSensorsEngine) ProcessSensorData(data map[string]interface{}) {
	fmt.Println("[NeuroSensorsEngine] Sensor data processed:", data)
}
