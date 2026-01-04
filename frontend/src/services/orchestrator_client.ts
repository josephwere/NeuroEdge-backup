export class OrchestratorClient {
  async sendCommand(command: string) {
    const res = await fetch("/api/orchestrator/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    return res.json();
  }

  async sendMessage(message: string) {
    const res = await fetch("/api/orchestrator/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return res.json();
  }
}
