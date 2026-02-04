import { Request, Response } from "express";
import { globalKernelManager } from "@services/kernelManager";
import { KernelCommand } from "@services/kernelComm";

/**
 * Handles code/command execution requests
 */
export async function handleExecution(req: Request, res: Response) {
  const { kernelId, code } = req.body;

  if (!kernelId || !code) {
    return res.status(400).json({ error: "Missing kernelId or code" });
  }

  const cmd: KernelCommand = {
    id: `exec-${Date.now()}`,
    type: "execute",
    payload: { code },
  };

  try {
    const result = await globalKernelManager.sendCommand(kernelId, cmd);
    res.json(result);
  } catch (err) {
    console.error("[executionHandler] Error executing code:", err);
    res.status(500).json({ error: "Kernel execution failed" });
  }
}
