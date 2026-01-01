package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type FraudDetectionAgent struct {
	EventBus *core.EventBus
}

func NewFraudDetectionAgent(bus *core.EventBus) *FraudDetectionAgent {
	return &FraudDetectionAgent{
		EventBus: bus,
	}
}

func (f *FraudDetectionAgent) Start() {
	fmt.Println("🚀 FraudDetectionAgent started")
	ch := make(chan map[string]interface{})
	f.EventBus.Subscribe("fraud:detect", ch)
	go func() {
		for event := range ch {
			fmt.Println("[FraudDetectionAgent] Fraud Event:", event)
			f.DetectFraud(event)
		}
	}()
}

func (f *FraudDetectionAgent) Stop() {
	fmt.Println("🛑 FraudDetectionAgent stopped")
}

func (f *FraudDetectionAgent) Name() string {
	return "FraudDetectionAgent"
}

func (f *FraudDetectionAgent) DetectFraud(data map[string]interface{}) {
	fmt.Println("[FraudDetectionAgent] Detecting fraud patterns:", data)
}
