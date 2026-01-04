import asyncio
from reasoner import CodeReasoner
from utils import EventBusClient

class MLOrchestrator:
    def __init__(self):
        self.reasoner = CodeReasoner()
        self.event_bus = EventBusClient()

    async def start(self):
        print("🧠 ML Orchestrator started...")
        await self.event_bus.subscribe("dev:code_event", self.handle_code_event)

    async def handle_code_event(self, payload):
        """
        Example payload could include:
        {
            "file": "main.go",
            "error_log": "...",
            "command": "build"
        }
        """
        proposal = self.reasoner.analyze(payload)
        await self.event_bus.emit("ml:proposal", proposal)

if __name__ == "__main__":
    orchestrator = MLOrchestrator()
    asyncio.run(orchestrator.start())
