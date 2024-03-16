from pydantic import BaseModel
from typing import Optional

class SingleNutrient(BaseModel):
       name: str
       label: str
       quantity: float
       unit: str


class Nutrition(BaseModel):
    calories: Optional[SingleNutrient] = None
    fat: Optional[SingleNutrient] = None
    sugar: Optional[SingleNutrient] = None
    carbohydrates: Optional[SingleNutrient]  = None
    protein: Optional[SingleNutrient] = None
    fiber: Optional[SingleNutrient] = None
    cholesterol: Optional[SingleNutrient] = None
    water: Optional[SingleNutrient] = None

    def dict(self):
        return {
            "calories": self.calories.dict() if self.calories else None,
            "fat": self.fat.dict() if self.fat else None,
            "sugar": self.sugar.dict() if self.sugar else None,
            "carbohydrates": self.carbohydrates.dict() if self.carbohydrates else None,
            "protein": self.protein.dict() if self.protein else None,
            "fiber": self.fiber.dict() if self.fiber else None,
            "cholesterol": self.cholesterol.dict() if self.cholesterol else None,
            "water": self.water.dict() if self.water else None
        }