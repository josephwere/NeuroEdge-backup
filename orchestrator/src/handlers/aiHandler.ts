import { Request, Response } from "express";
import { globalKernelManager } from "../services/kernelManager";
import { KernelCommand } from "../services/kernelComm";

/**
 * Handles AI inference requests
 */
export async function handleAIInference(req: Request, res: Response) {
  const { kernelId, input } = req.body;

  if (!kernelId || !input) {
    return res.status(400).json({ error: "Missing kernelId or input" });
  }

  const cmd: KernelCommand = {
    id: `ai-${Date.now()}`,
    type: "ai_inference",
    payload: { input },
  };

  try {
    const result = await globalKernelManager.sendCommand(kernelId, cmd);
    res.json(result);
  } catch (err) {
    console.error("[aiHandler] Error during AI inference:", err);
    res.status(500).json({ error: "Kernel AI inference failed" });
  }
}
