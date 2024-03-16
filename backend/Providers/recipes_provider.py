import aiohttp
from typing import Tuple, Any
from secrets_storage import API_KEY_TASTY_RAPIDAPI, HOST_TASTY_RAPIDAPI

BASE_URL_TASTY_RAPID_API = "https://tasty.p.rapidapi.com"

HEADERS = {
	"X-RapidAPI-Key": API_KEY_TASTY_RAPIDAPI,
	"X-RapidAPI-Host": HOST_TASTY_RAPIDAPI
}


async def get_meals_by_search_query(size: int, search_query: str = "", tags: str = "", from_: int = 0):
    url = BASE_URL_TASTY_RAPID_API + "/recipes/list"
    params = {"from": from_, "size": size, "tags": tags, "q": search_query}
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        async with session.get(url, params=params) as response:
            response_json = await response.json()
            response_status = response.status
    return response_json, response_status


async def get_recipe_details(recipe_id: int):
    url = BASE_URL_TASTY_RAPID_API + "/recipes/get-more-info"
    params = {"id": recipe_id}
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        async with session.get(url, params=params) as response:
            response_json = await response.json()
            response_status = response.status
    return response_json, response_status


async def get_similar_meals_autocompleted(search_query: str):
    url = BASE_URL_TASTY_RAPID_API + "/recipes/auto-complete"
    params = {"prefix": search_query}
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        async with session.get(url, params=params) as response:
            response_json = await response.json()
            response_status = response.status
    return response_json, response_status


async def get_tags() -> Tuple[Any, int]:
    url = BASE_URL_TASTY_RAPID_API + "/tags/list"
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        async with session.get(url) as response:
            response_json = await response.json()
            response_status = response.status
    return response_json, response_status
