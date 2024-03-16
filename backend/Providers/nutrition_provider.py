import aiohttp
from secrets_storage import API_KEY_EDAMAM, APP_ID_EDAMAM


BASE_URL_EDAMAM_API = "https://api.edamam.com/api/nutrition-data"


async def get_product_nutition_data(meal: str):
    params = {"app_id": APP_ID_EDAMAM,
	"app_key": API_KEY_EDAMAM, "nutrition-type": "cooking", "ingr": meal}

    async with aiohttp.ClientSession() as session:
        async with session.get(url=BASE_URL_EDAMAM_API, params=params) as response:
            response_json = await response.json()
            response_status = response.status
    return response_json, response_status