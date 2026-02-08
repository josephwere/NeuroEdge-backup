package generated

import (
	"context"
)

// TaskRequest is a stub for gRPC request
type TaskRequest struct {
	EngineName string
	TaskId     string
	InputData  string
}

// TaskResponse is a stub for gRPC response
type TaskResponse struct {
	TaskId     string
	Status     string
	OutputData string
}

// OrchestratorClient stub
type OrchestratorClient struct{}

// NewOrchestratorClient returns a stub client
func NewOrchestratorClient() *OrchestratorClient {
	return &OrchestratorClient{}
}

// SubmitTask stub mimicking gRPC call
func (o *OrchestratorClient) SubmitTask(ctx context.Context, req *TaskRequest) (*TaskResponse, error) {
	// dummy response
	return &TaskResponse{
		TaskId:     req.TaskId,
		Status:     "success",
		OutputData: "{}",
	}, nil
}
