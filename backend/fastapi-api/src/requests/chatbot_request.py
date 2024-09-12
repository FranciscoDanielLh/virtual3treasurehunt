from pydantic import BaseModel

class ChatBotRequest(BaseModel):
    prompt: str
    client_tag: str