// orchestrator/services/kernelComm.ts

import axios, { AxiosInstance } from "axios";

/* -------------------- */
/* Types */
/* -------------------- */

export interface KernelCommand {
  id: string;
  type: "chat" | "execute" | "ai_inference";
  payload: any;
  metadata?: Record<string, any>;
}

export interface KernelResponse {
  id: string;
  success: boolean;
  stdout?: string;
  stderr?: string;
  approvals?: any[];
  reasoning?: string;
  risk?: "low" | "medium" | "high";
  timestamp: string;
}

export interface KernelInfo {
  version: string;
  capabilities: string[];
  status: "ready" | "busy" | "offline";
  nodes?: string[];
}

/* -------------------- */
/* Kernel Client Class */
/* -------------------- */

export class KernelClient {
  private baseUrl: string;
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /* -------------------- Health Check -------------------- */
  async health(): Promise<{ status: string }> {
    try {
      const resp = await this.client.get("/health");
      return resp.data;
    } catch (err) {
      console.error("Kernel health check failed:", err);
      return { status: "offline" };
    }
  }

  /* -------------------- Get Capabilities / Nodes -------------------- */
  async getInfo(): Promise<KernelInfo> {
    try {
      const resp = await this.client.get("/info");
      return resp.data;
    } catch (err) {
      console.error("Failed to fetch kernel info:", err);
      return {
        version: "unknown",
        capabilities: [],
        status: "offline",
      };
    }
  }

  /* -------------------- Send Command -------------------- */
  async sendCommand(cmd: KernelCommand): Promise<KernelResponse> {
    try {
      const resp = await this.client.post("/execute", cmd);
      return resp.data;
    } catch (err) {
      console.error("Kernel command failed:", err);
      return {
        id: cmd.id,
        success: false,
        stderr: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /* -------------------- Retry Wrapper -------------------- */
  async sendWithRetry(cmd: KernelCommand, retries = 2, delayMs = 500): Promise<KernelResponse> {
    let attempt = 0;
    while (attempt <= retries) {
      const res = await this.sendCommand(cmd);
      if (res.success) return res;
      attempt++;
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return {
      id: cmd.id,
      success: false,
      stderr: "Kernel command failed after retries",
      timestamp: new Date().toISOString(),
    };
  }
    }
