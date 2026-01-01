package agents

import (
	"fmt"
	"neuroedge/kernel/core"
)

type JobRecruiterAgent struct {
	EventBus *core.EventBus
}

func NewJobRecruiterAgent(bus *core.EventBus) *JobRecruiterAgent {
	return &JobRecruiterAgent{
		EventBus: bus,
	}
}

func (j *JobRecruiterAgent) Start() {
	fmt.Println("🚀 JobRecruiterAgent started")
	ch := make(chan map[string]interface{})
	j.EventBus.Subscribe("recruitment:new", ch)
	go func() {
		for event := range ch {
			fmt.Println("[JobRecruiterAgent] Recruitment Event:", event)
			j.MatchCandidates(event)
		}
	}()
}

func (j *JobRecruiterAgent) Stop() {
	fmt.Println("🛑 JobRecruiterAgent stopped")
}

func (j *JobRecruiterAgent) Name() string {
	return "JobRecruiterAgent"
}

func (j *JobRecruiterAgent) MatchCandidates(data map[string]interface{}) {
	fmt.Println("[JobRecruiterAgent] Matching candidates:", data)
}
