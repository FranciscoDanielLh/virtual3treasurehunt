from pydantic import BaseModel

class SpeechToTextRequest(BaseModel):
    url: str