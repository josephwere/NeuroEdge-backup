package core

import (
	"encoding/json"
	"fmt"

	pb "neuroedge/kernel/ml/orchestrator/generated"
)

type PythonClient struct {
	client *pb.OrchestratorClient
}

func NewPythonClient() *PythonClient {
	return &PythonClient{
		client: pb.NewOrchestratorClient(),
	}
}

func (pc *PythonClient) SubmitTask(engineName string, taskID string, input interface{}) {
	inputJSON, _ := json.Marshal(input)

	err := pc.client.ExecuteTask(taskID, map[string]interface{}{
		"engine": engineName,
		"input":  string(inputJSON),
	})

	if err != nil {
		fmt.Println("⚠️ Task failed:", err)
		return
	}

	fmt.Printf("✅ Task %s executed successfully\n", taskID)
}

func (pc *PythonClient) Close() {}
