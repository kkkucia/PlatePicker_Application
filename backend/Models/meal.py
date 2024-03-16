from pydantic import BaseModel

class Meal(BaseModel):
    id: int
    name: str
    description: str
    quantity: int = 1

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "quantity": self.quantity,
        }

