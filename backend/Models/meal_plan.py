from typing import List
from pydantic import BaseModel

from Models.meal import Meal
from Models.nutrition import Nutrition

class MealPlan(BaseModel):
    meal: Meal
    instructions: List[str]
    nutrition_of_products: Nutrition

    def dict(self):
        return {
            "meal": self.meal.dict(),
            "nutrition_of_products": self.nutrition_of_products.dict(),
            "instructions": self.instructions
        }