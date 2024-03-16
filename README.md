# PlatePicker Application

Struggling to decide what to eat? Need inspiration for your next meal? PlatePicker is the perfect app for you! Discover a variety of dinner ideas, explore calorie and nutrient content, and even plan your daily diet effortlessly. Use PlatePicker today and make mealtime decisions a breeze!

## Requirements

- [ Docker ](https://docs.docker.com/engine/install/) installed (Docker version 25.0.3 or higher)
- [Edamam API credentials](https://developer.edamam.com/edamam-docs-nutrition-api) added in secret_storage file (You have to log in to get API_KEY and APP_ID)
- [Rapidapi API credentials](https://rapidapi.com/apidojo/api/tasty/) added in secret_storage file (You have to log in to get API_KEY)

## Run Application

To run the application via docker, follow these steps:

1. Find the secrets_storage file in the /PlatePickerApp/backend directory and complete with secrets generated from api's

2. Go to the project main directory (PlatePickerApp directory)

3. Check installed docker version

```bash
  docker --version
```

4. Build docker image and run containers

```bash
  docker-compose up --build
```

5. The application is running on <http://localhost:3000>

6. Swagger UI documentation is available here <http://localhost:9001/docs>

7. To stop the application, press Ctrl+C in the terminal where you started the application using Docker Compose

## Author

- [Karolina Kucia](https://github.com/kkkucia)
