from typing import Dict, List

from Models.meal_plan import MealPlan
from Models.tag import Tag
from Models.meal import Meal
from Models.recipe import Recipe
from Models.nutrition import Nutrition, SingleNutrient

class DataServiceHelper:

    @staticmethod
    async def extrac_meal_plan_data(meal_data: dict, nutition_data: List):
        meal_plan = {}
        ingridients = []
        if "results" in meal_data:
            meal_info = meal_data["results"][0]
            meal = Meal(
                id=meal_info["id"],
                name=meal_info["name"],
                description=meal_info["description"])
            
            nutrition = await DataServiceHelper.count_nutrition(nutition_data)
                
            meal_plan = MealPlan(
                meal=meal,
                instructions=[instruction["display_text"] for instruction in meal_info["instructions"]],
                ingridients=ingridients,
                nutrition_of_products=nutrition
                )
        return meal_plan.dict()
    
    
    @staticmethod
    async def extract_recipe(recipe_data: dict, meal: Meal) -> dict:
        recipe = {}
        time = "Not provided"
        if recipe_data["total_time_minutes"] is not None:
            time = recipe_data["total_time_minutes"]
        recipe = Recipe(
                meal=meal,
                estimated_time=time,
                ingredients=[ingridient["raw_text"] for ingridient in recipe_data["sections"][0]["components"]],
                instructions=[instruction["display_text"] for instruction in recipe_data["instructions"]]
                )
        return recipe.dict()
    
    @staticmethod
    async def extract_ingidients(meal_data: dict) -> List[str]:
        ingredients= []
        for section in meal_data["sections"]:
            for c in section["components"]:
                ingredients.append([c["ingredient"]["display_singular"],
                                    c["measurements"][0]["quantity"]])
        return ingredients
    
    @staticmethod
    async def extract_recipe_ingridients(recipe_data: dict) -> List[str]:
        return recipe_data["ingredients"]
    
    
    @staticmethod
    async def extract_meal(meal_data: dict) -> Meal:
        meal = None
        if "results" in meal_data:
            meal_info = meal_data["results"][0]
            
            meal = Meal(
                id=meal_info["id"],
                name=meal_info["name"],
                description=meal_info["description"])
        return meal
    
    
    @staticmethod
    async def filter_tags(tags_data: dict) -> Dict[str, Tag]:
        allowed_root_types = {"cuisine", "dietary", "difficulty","meal", "cooking_style"}
        filtered_tags = {}

        if "results" in tags_data:
            for tag_data in tags_data["results"]:
                if tag_data.get("root_tag_type") in allowed_root_types:
                    tag = Tag(
                        name=tag_data["display_name"],
                        id=tag_data["id"],
                        type=tag_data["root_tag_type"]
                    )
                    filtered_tags[tag_data["name"]] = tag.dict()

        return filtered_tags
    
    @staticmethod
    async def filter_meals_similar(meals_data: dict) -> Dict[str, List[Dict[str, str]]]:
        filtered_meals = []

        if "results" in meals_data:
            for meal_data in meals_data["results"]:
                    filtered_meals.append({"name": meal_data["search_value"]})
        return {"meals" : filtered_meals}
    
    @staticmethod
    async def filter_meals_inspiration(meals_data: dict) -> Dict[str, List[Dict[str, str]]]:
        filtered_meals = []

        if "results" in meals_data:
            for meal_data in meals_data["results"]:
                    filtered_meals.append({"name": meal_data["name"]})
        return {"meals" : filtered_meals}


    @staticmethod
    async def extract_important_nutrition(nutrition_data: dict) -> Nutrition:
        filtered_nutrition = {}
        total_nutrients = nutrition_data.get("totalNutrients", {})
        if total_nutrients:
            filtered_nutrition = Nutrition(
                calories=SingleNutrient(
                    name="calories",
                    label=total_nutrients.get("ENERC_KCAL", {}).get("label", ""),
                    quantity=total_nutrients.get("ENERC_KCAL", {}).get("quantity", 0),
                    unit=total_nutrients.get("ENERC_KCAL", {}).get("unit", "")
                ),
                fat=SingleNutrient(
                    name="fat",
                    label=total_nutrients.get("FAT", {}).get("label", ""),
                    quantity=total_nutrients.get("FAT", {}).get("quantity", 0),
                    unit=total_nutrients.get("FAT", {}).get("unit", "")
                ),
                sugar=SingleNutrient(
                    name="sugar",
                    label=total_nutrients.get("SUGAR", {}).get("label", ""),
                    quantity=total_nutrients.get("SUGAR", {}).get("quantity", 0),
                    unit=total_nutrients.get("SUGAR", {}).get("unit", "")
                ),
                carbohydrates=SingleNutrient(
                    name="carbohydrates",
                    label=total_nutrients.get("CHOCDF", {}).get("label", ""),
                    quantity=total_nutrients.get("CHOCDF", {}).get("quantity", 0),
                    unit=total_nutrients.get("CHOCDF", {}).get("unit", "")
                ),
                protein=SingleNutrient(
                    name="protein",
                    label=total_nutrients.get("PROCNT", {}).get("label", ""),
                    quantity=total_nutrients.get("PROCNT", {}).get("quantity", 0),
                    unit=total_nutrients.get("PROCNT", {}).get("unit", "")
                ),
                fiber=SingleNutrient(
                    name="fiber",
                    label=total_nutrients.get("FIBTG", {}).get("label", ""),
                    quantity=total_nutrients.get("FIBTG", {}).get("quantity", 0),
                    unit=total_nutrients.get("FIBTG", {}).get("unit", "")
                ),
                cholesterol=SingleNutrient(
                    name="cholesterol",
                    label=total_nutrients.get("CHOLE", {}).get("label", ""),
                    quantity=total_nutrients.get("CHOLE", {}).get("quantity", 0),
                    unit=total_nutrients.get("CHOLE", {}).get("unit", "")
                ),
                water=SingleNutrient(
                    name="water",
                    label=total_nutrients.get("WATER", {}).get("label", ""),
                    quantity=total_nutrients.get("WATER", {}).get("quantity", 0),
                    unit=total_nutrients.get("WATER", {}).get("unit", "")
                )
            )
        return filtered_nutrition
    
    @staticmethod
    async def filter_nutrition(nutrition_data: dict) -> Dict[str, SingleNutrient]:
        filtered_nutrition:Nutrition = await DataServiceHelper.extract_important_nutrition(nutrition_data)
        if filtered_nutrition:
            return filtered_nutrition.dict()
        return {}
    
    async def count_nutrition(nutrition_list: List[Dict[str, Dict[str, any]]]) -> Dict[str, Dict[str, any]]:
        total_nutrition: Dict[str, Dict[str, any]] = {
        "calories": {"name": "calories", "label": "Energy", "quantity": 0, "unit": "kcal"},
        "fat": {"name": "fat", "label": "Total lipid (fat)", "quantity": 0, "unit": "g"},
        "sugar": {"name": "sugar", "label": "Sugars, total including NLEA", "quantity": 0, "unit": "g"},
        "carbohydrates": {"name": "carbohydrates", "label": "Carbohydrate, by difference", "quantity": 0, "unit": "g"},
        "protein": {"name": "protein", "label": "Protein", "quantity": 0, "unit": "g"},
        "fiber": {"name": "fiber", "label": "Fiber, total dietary", "quantity": 0, "unit": "g"},
        "cholesterol": {"name": "cholesterol", "label": "Cholesterol", "quantity": 0, "unit": "mg"},
        "water": {"name": "water", "label": "Water", "quantity": 0, "unit": "g"}
    }

        for nutrition_tuple in nutrition_list:
            nutrition = nutrition_tuple[0]
            for nutrient in total_nutrition:
                if nutrient in nutrition and "quantity" in nutrition[nutrient]:
                    total_nutrition[nutrient]["quantity"] += nutrition[nutrient]["quantity"]

        return total_nutrition