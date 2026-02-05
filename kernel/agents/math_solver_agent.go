// kernel/agents/math_solver_agent.go
package agents

import (
	"fmt"
	"math"

	"neuroedge/kernel/types" // Use types for EventBus to break cycles
)

type MathSolverAgent struct {
	EventBus *types.EventBus
}

func NewMathSolverAgent(bus *types.EventBus) *MathSolverAgent {
	return &MathSolverAgent{
		EventBus: bus,
	}
}

func (m *MathSolverAgent) Start() {
	fmt.Println("🚀 MathSolverAgent started")
	ch := make(chan map[string]interface{})
	m.EventBus.Subscribe("math:solve", ch)
	go func() {
		for event := range ch {
			fmt.Println("[MathSolverAgent] Solve Event:", event)
			m.SolveProblem(event)
		}
	}()
}

func (m *MathSolverAgent) Stop() {
	fmt.Println("🛑 MathSolverAgent stopped")
}

func (m *MathSolverAgent) Name() string {
	return "MathSolverAgent"
}

func (m *MathSolverAgent) SolveProblem(data map[string]interface{}) {
	if val, ok := data["expression"].(float64); ok {
		result := math.Sqrt(val) // Example: sqrt calculation
		fmt.Println("[MathSolverAgent] Solution:", result)
	}
}
