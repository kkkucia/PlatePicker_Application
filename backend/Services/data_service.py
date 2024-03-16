import random
from typing import List, Tuple, Any
from Models.meal import Meal
from Helpers.data_service_helper import DataServiceHelper
from Providers.nutrition_provider import get_product_nutition_data
from Providers.recipes_provider import get_tags, get_recipe_details, get_similar_meals_autocompleted, get_meals_by_search_query

class DataService:
    def __init__(self):
        self.helper = DataServiceHelper()


    async def get_tags(self) -> Tuple[Any, int]:
        tags, status = await get_tags()
        if status == 200:
            filtered_tags = await self.helper.filter_tags(tags)
            return filtered_tags, status
        return tags, status
    

    async def get_meal_nutrition(self, quantity: int, meal: str) -> Tuple[Any, int]:
        search_query = str(quantity)  + " " + meal
        nutition, status = await get_product_nutition_data(search_query)
        if status == 200:
            filtered_nutrition = await self.helper.filter_nutrition(nutition)
            return filtered_nutrition, status
        return nutition, status
    
    
    async def get_similar_meals(self, search_query: str) -> Tuple[Any, int]:
        meals, status = await get_similar_meals_autocompleted(search_query)
        if status == 200:
            filtered_meals = await self.helper.filter_meals_similar(meals)
            return filtered_meals, status
        return meals, status
    
    async def get_meal_inspiration(self, search_query: str, tag: str,) -> Tuple[Any, int]:
        meals, status = await get_meals_by_search_query(20, search_query, tag)
        if status == 200:
            filtered_meals = await self.helper.filter_meals_inspiration(meals)
            return filtered_meals, status
        return meals, status


    async def get_meal_recipe(self, meal: str) -> Tuple[Any, int]:
        meal_data, status_meal_data = await get_meals_by_search_query(1, meal)
        if status_meal_data == 200:
            meal: Meal = await self.helper.extract_meal(meal_data)
            if meal is not None:
                recipe_data, status_recipe_data = await get_recipe_details(meal.id)
                if status_recipe_data == 200:
                    recipe = await self.helper.extract_recipe(recipe_data, meal)
                    return recipe, status_recipe_data
            return recipe_data, status_recipe_data
        return meal_data, status_meal_data
    

    async def get_meal_ingredients(self, meal: str) -> Tuple[Any, int]:
        recipe_data, status = await self.get_meal_recipe(meal)
        if status == 200:
            ingredients = await self.helper.extract_recipe_ingridients(recipe_data)
            return ingredients, status
        return recipe_data, status
    
    
    async def get_plan(self):
        # meal_names = [["breakfast", "breakfast"], ["lunch", "lunch"], ["snack", "snacks"], ["appetizer", "appetizers"], ["dinner", "dinner"]] 
        meal_names = [["breakfast", "breakfast"], ["lunch", "lunch"], ["dinner", "dinner"]] # reduced number of dishes due to query limitations of free external api versions
        meals = {}
        for meal in meal_names:
            meals[meal[0]], status = await self.generate_random_meal(meal[0], meal[1])
            if status != 200:
                return {"message": "Cannot arrange a plan"}, status
        return meals, status
    
    async def generate_random_meal(self, meal_name: str, meal_tag: str) -> Tuple[Any, int]:
        random_number = random.randint(0, 39)
        meal_data, status_meal_data = await get_meals_by_search_query(1, "", meal_tag, random_number)

        if status_meal_data == 200:
            meal: Meal = await self.helper.extract_meal(meal_data)
            if meal is not None:
                ingridients_data, status_ingridients_data = await get_recipe_details(meal.id)
                if status_ingridients_data == 200:
                    ingidients = await self.helper.extract_ingidients(ingridients_data)
                    nutrition_list = await DataService.add_nutrition_response(self, ingidients)
                    plan_meal = await self.helper.extrac_meal_plan_data(meal_data, nutrition_list)
                    return plan_meal, status_meal_data
            return ingridients_data, status_ingridients_data
        return meal_data, status_meal_data
    
    
    async def add_nutrition_response(self, ingidients: List[List]) ->  List:
        nutrition_list = []
        nutrition_list.clear()
        for ingidient in ingidients:
            nutrition_data = await DataService.get_meal_nutrition(self, ingidient[1],ingidient[0])
            if nutrition_data:
                nutrition_list.append(nutrition_data)
        return nutrition_list
