import { createFloatingChatUI } from "./floating_ui";
import { OrchestratorClient } from "../api/orchestrator_client";

export class FloatingChat {
  private logArea: HTMLElement;
  private input: HTMLInputElement;
  private orchestrator: OrchestratorClient;

  constructor(orchestrator: OrchestratorClient) {
    const ui = createFloatingChatUI();
    this.logArea = ui.logArea;
    this.input = ui.input;
    this.orchestrator = orchestrator;
    this.setupInput();
  }

  private setupInput() {
    this.input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && this.input.value.trim() !== "") {
        const command = this.input.value.trim();
        this.addLog(`> ${command}`);
        this.input.value = "";

        try {
          const response = await this.orchestrator.sendCommand(command);

          // Show ML reasoning
          if (response.reasoning) {
            this.addLog("🧠 ML: " + response.reasoning);
          }

          // Live stream execution logs
          if (response.execution) {
            response.execution.split("\n").forEach((line) => this.addLog(line));
          }
        } catch (err: any) {
          this.addLog(`❌ Error: ${err.message || err}`);
        }
      }
    });
  }

  public addLog(msg: string) {
    const p = document.createElement("div");
    p.innerText = msg;
    this.logArea.appendChild(p);
    this.logArea.scrollTop = this.logArea.scrollHeight;
  }
          }
