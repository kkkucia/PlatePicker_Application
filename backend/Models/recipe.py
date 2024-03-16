from typing import List
from pydantic import BaseModel

from Models.meal import Meal


class Recipe(BaseModel):
    meal: Meal
    estimated_time: str
    ingredients: List[str]
    instructions: List[str]

    def dict(self):
        return {
            "meal": self.meal.dict(),
            "estimated_time": self.estimated_time,
            "ingredients": self.ingredients,
            "instructions": self.instructions
        }

