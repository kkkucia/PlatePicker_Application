from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from Services.auth_service import AuthService
from Models.user import User
from Services.data_service import DataService


app=FastAPI(title="PlatePicker", description="Struggling to decide what to eat? Need inspiration for your next meal? PlatePicker is the perfect app for you! Discover a variety of dinner ideas, explore calorie and nutrient content, and even plan your daily diet effortlessly. Use  PlatePicker today and make mealtime decisions a breeze!", version="1.0")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:9001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

data_service = DataService()
auth_service = AuthService()

users = {} # TODO In the feature: make separated database

@app.post("/register", tags=["Auth"])
async def register_user(user : User) -> JSONResponse:
    username = user.username

    if username != None and username in users:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="The user already exists.")

    user.password = auth_service.hash_password(user.password)
    users[username] = user

    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content={"message": "User created successfully."})


@app.post("/login", tags=["Auth"])
async def login_user(user : User) -> JSONResponse:
    username, password = user.username, user.password
    if username is None or username not in users:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login credentials.")

    if not auth_service.verify_password(password, users[username].password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.")

    token = auth_service.create_token(username)
    return JSONResponse(status_code=status.HTTP_200_OK, content={'token': token})


@app.delete("/unregister", tags=["Auth"])
async def unregister_user(user : User, token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    username, password = user.username, user.password
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user credentials.")
    
    if not auth_service.verify_password(password, users[username].password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.")
    
    if username not in users:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User have been unregistered. Create new account.")

    users.pop(username)
    return JSONResponse(status_code=status.HTTP_200_OK, content={'message': "User unregistered successfully."})


@app.post("/token", tags=["Auth"])
async def login_for_access_token(oAuth_data: OAuth2PasswordRequestForm = Depends()) -> JSONResponse:
    username, password = oAuth_data.username, oAuth_data.password

    if username is None or username not in users:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login credentials.")

    if not auth_service.verify_password(password, users[username].password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.")

    token = auth_service.create_token(username)
    return JSONResponse(status_code=status.HTTP_200_OK, content= {"access_token": token, "token_type": "bearer"})


@app.get("/meals/tags", tags=["Meals"])
async def get_meal_tags(token: str = Depends(auth_service.verify_token)) -> JSONResponse:
     data, data_status = await data_service.get_tags()
     if data_status != status.HTTP_200_OK:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with tag search. Chceck API's credentials.")
     
     return JSONResponse(status_code=status.HTTP_200_OK, content={"tags": data })


@app.get("/meals/similar", tags=["Meals"])
async def get_similar_meals(search_query: str, token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    if search_query is None:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search query cannot be empty.")
    data, data_status = await data_service.get_similar_meals(search_query)

    if data_status != status.HTTP_200_OK:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with similar dish search. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"meals": data })


@app.get("/meals/{meal}/{quantity}/nutrition", tags=["Meals"])
async def get_meal_nutrition(meal: str, quantity: int, token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    if meal is None:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Meal must be specified.")
    
    if quantity <= 0:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be greater than zero.")
    
    data, data_status = await data_service.get_meal_nutrition(quantity, meal)
    if data_status != status.HTTP_200_OK:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with nutrition search. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"nutrition": data })


@app.get("/meals/plan", tags=["Meal Plan"])
async def get_meals_plan_for_all_day( token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    data, data_status = await data_service.get_plan()
    if data_status != status.HTTP_200_OK:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with plan preparation. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"plan": data })


@app.get("/meals/{meal}/recipe", tags=["Recipes"])
async def get_recipe(meal: str, token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    if meal is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Meal must be specified.")

    data, data_status = await data_service.get_meal_recipe(meal)
    if data_status != status.HTTP_200_OK:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with recipe search. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"recipe": data })


@app.get("/meals/{meal}/recipe/ingredients", tags=["Recipes"])
async def get_recipe_ingredients(meal: str, token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    if meal is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Meal must be specified.")

    data, data_status = await data_service.get_meal_ingredients(meal)
    if data_status != status.HTTP_200_OK:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with ingredients search. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"ingredients": data })


@app.get("/meals/inspiration", tags=["Meals"])
async def get_meal_inspiration(search_query: str, tag: str="", token: str = Depends(auth_service.verify_token)) -> JSONResponse:
    if search_query == "" and tag == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search query or tag cannot be empty.")
    
    data, data_status = await data_service.get_meal_inspiration(search_query, tag)
    if data_status != status.HTTP_200_OK:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected problem with inspiration search. Chceck API's credentials.")
    
    return JSONResponse(status_code=status.HTTP_200_OK, content={"inspiration": data })

@app.get("/")
async def hello() :
    return {"message" : "Hello! Are You Lost? Check: http://localhost/docs"}
