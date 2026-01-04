import asyncio
import json
import websockets

class EventBusClient:
    """
    Connects Python ML orchestrator to TS event bus via WebSocket
    """

    def __init__(self, url="ws://localhost:8080/eventbus"):
        self.url = url
        self.subscriptions = {}

    async def subscribe(self, event_name: str, callback):
        """
        Subscribe to event bus messages from TS orchestrator
        """
        self.subscriptions[event_name] = callback
        asyncio.create_task(self.listen())

    async def emit(self, event_name: str, payload: dict):
        """
        Send event to TS orchestrator
        """
        async with websockets.connect(self.url) as ws:
            message = json.dumps({"event": event_name, "payload": payload})
            await ws.send(message)

    async def listen(self):
        async with websockets.connect(self.url) as ws:
            async for message in ws:
                data = json.loads(message)
                event_name = data.get("event")
                payload = data.get("payload")
                if event_name in self.subscriptions:
                    await self.subscriptions[event_name](payload)
