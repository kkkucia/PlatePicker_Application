from pydantic import BaseModel

class User(BaseModel):
    password: str
    username: str