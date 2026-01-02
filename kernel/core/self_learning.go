package core

import (
	"fmt"
	"log"
	"sync"
	"time"

	"neuroedge/kernel/agents"
	"neuroedge/kernel/engines"
)

// SelfLearningLoop manages continuous improvement for NeuroEdge
type SelfLearningLoop struct {
	interval    time.Duration
	stopChan    chan bool
	mu          sync.Mutex
	active      bool
	agentMgr    *agents.Manager
	engineMgr   *engines.EngineManager
}

// NewSelfLearningLoop creates a new self-learning loop
func NewSelfLearningLoop(agentMgr *agents.Manager, engineMgr *engines.EngineManager, interval time.Duration) *SelfLearningLoop {
	return &SelfLearningLoop{
		interval:  interval,
		stopChan:  make(chan bool),
		active:    false,
		agentMgr:  agentMgr,
		engineMgr: engineMgr,
	}
}

// Start begins the continuous self-learning loop
func (s *SelfLearningLoop) Start() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.active {
		return
	}
	s.active = true

	fmt.Println("🤖 Self-Learning Loop Started")

	go func() {
		ticker := time.NewTicker(s.interval)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				s.runIteration()
			case <-s.stopChan:
				fmt.Println("🛑 Self-Learning Loop Stopped")
				return
			}
		}
	}()
}

// Stop stops the self-learning loop
func (s *SelfLearningLoop) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if !s.active {
		return
	}
	s.stopChan <- true
	s.active = false
}

// runIteration executes one learning cycle
func (s *SelfLearningLoop) runIteration() {
	fmt.Println("🔄 Self-Learning Iteration started")

	// 1️⃣ Evaluate agents
	for _, ag := range s.agentMgr.GetAllAgents() {
		success := ag.EvaluatePerformance()
		if !success {
			log.Printf("⚠️ Agent %s requires improvement\n", ag.Name())
			ag.Learn() // retrain or adapt
		}
	}

	// 2️⃣ Evaluate engines
	for _, eng := range s.engineMgr.GetAllEngines() {
		stable := eng.EvaluatePerformance()
		if !stable {
			log.Printf("⚠️ Engine %s requires optimization\n", eng.Name())
			eng.Optimize() // improve reasoning, caching, or compute
		}
	}

	// 3️⃣ Aggregate feedback
	s.aggregateFeedback()

	fmt.Println("✅ Self-Learning Iteration completed")
}

// aggregateFeedback collects metrics from mesh, users, and tasks
func (s *SelfLearningLoop) aggregateFeedback() {
	// Placeholder: in future, pull metrics from mesh nodes & task results
	fmt.Println("📊 Aggregating feedback from agents, engines, and mesh nodes...")
}
