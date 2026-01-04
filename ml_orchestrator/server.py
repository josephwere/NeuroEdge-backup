from fastapi import FastAPI
from pydantic import BaseModel
import subprocess

app = FastAPI(title="NeuroEdge ML Orchestrator")

class CommandRequest(BaseModel):
    command: str
    args: list = []

@app.post("/propose")
def propose_command(req: CommandRequest):
    # Simulate ML reasoning for now
    explanation = f"ML suggests executing '{req.command}' with args {req.args}"
    return {"explanation": explanation}

@app.post("/execute")
def execute_command(req: CommandRequest):
    try:
        result = subprocess.run([req.command, *req.args], capture_output=True, text=True)
        return {"stdout": result.stdout, "stderr": result.stderr, "success": result.returncode == 0}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "success": False}
