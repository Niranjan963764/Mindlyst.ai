import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .inference_engine import inference

# added async and file cleanup code

class AudioVideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        await super().disconnect(close_code)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            print(text_data)
            python_data = json.loads(text_data)
            if python_data.get('type') is not None:
                await self.send(text_data=json.dumps({"message" : "finished processing last chunk"}))
        if bytes_data:
            print("Received binary data")
            output = await inference(bytes_data)
            print(output)
            # self.send(text_data=json.dumps({"server" : "received binary data"}))
            await self.send(text_data=json.dumps({"prediction" : output}))