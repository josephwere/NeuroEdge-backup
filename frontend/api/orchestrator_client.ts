export interface OrchestratorResponse {
  reasoning: string;
  execution: string;
}

export class OrchestratorClient {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket("ws://localhost:4000/ws"); // TS Orchestrator WebSocket
  }

  sendCommand(command: string): Promise<OrchestratorResponse> {
    return new Promise((resolve) => {
      this.ws.send(JSON.stringify({ command }));

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        resolve({
          reasoning: data.reasoning,
          execution: data.execution,
        });
      };
    });
  }
}
