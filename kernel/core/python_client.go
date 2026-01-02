package core

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
	pb "neuroedge/ml/orchestrator/generated"
)

type PythonClient struct {
	conn   *grpc.ClientConn
	client pb.OrchestratorClient
}

func NewPythonClient(address string) (*PythonClient, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		return nil, err
	}
	client := pb.NewOrchestratorClient(conn)
	return &PythonClient{
		conn:   conn,
		client: client,
	}, nil
}

func (pc *PythonClient) SubmitTask(engineName string, taskID string, input interface{}) {
	inputJSON, _ := json.Marshal(input)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	req := &pb.TaskRequest{
		EngineName: engineName,
		TaskId:     taskID,
		InputData:  string(inputJSON),
	}

	resp, err := pc.client.SubmitTask(ctx, req)
	if err != nil {
		log.Printf("⚠️ Failed to submit task: %v", err)
		return
	}

	var output interface{}
	json.Unmarshal([]byte(resp.OutputData), &output)
	fmt.Printf("✅ Task %s completed with status %s, output: %+v\n", resp.TaskId, resp.Status, output)
}

func (pc *PythonClient) Close() {
	pc.conn.Close()
}
