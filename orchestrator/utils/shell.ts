import { spawn } from "child_process";

export function runCommand(
  command: string,
  args: string[] = [],
  cwd?: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", data => {
      stdout += data.toString();
    });

    proc.stderr.on("data", data => {
      stderr += data.toString();
    });

    proc.on("close", code => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({ stdout, stderr });
      }
    });
  });
        }
