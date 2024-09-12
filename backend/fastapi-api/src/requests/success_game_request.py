from pydantic import BaseModel

class SuccessGameRequest(BaseModel):
    percentage: str
    wallet: str