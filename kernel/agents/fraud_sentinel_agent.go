package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type FraudSentinelAgent struct {
	EventBus *core.EventBus
}

func NewFraudSentinelAgent(bus *core.EventBus) *FraudSentinelAgent {
	return &FraudSentinelAgent{
		EventBus: bus,
	}
}

func (f *FraudSentinelAgent) Start() {
	fmt.Println("🚀 FraudSentinelAgent started")
	ch := make(chan map[string]interface{})
	f.EventBus.Subscribe("fraud:detect:update", ch)
	go func() {
		for event := range ch {
			fmt.Println("[FraudSentinelAgent] Fraud Event:", event)
			f.DetectFraud(event)
		}
	}()
}

func (f *FraudSentinelAgent) Stop() {
	fmt.Println("🛑 FraudSentinelAgent stopped")
}

func (f *FraudSentinelAgent) Name() string {
	return "FraudSentinelAgent"
}

func (f *FraudSentinelAgent) DetectFraud(data map[string]interface{}) {
	fmt.Println("[FraudSentinelAgent] Fraud analysis result:", data)
}
