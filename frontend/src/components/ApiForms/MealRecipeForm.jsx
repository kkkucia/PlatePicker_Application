import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import ApiService from "../../services/ApiService";
import backgroundImage from "../../utils/pasta.jpg";
import CircularProgress from "@mui/material/CircularProgress";

const MealRecipeForm = () => {
  const [response, setResponse] = useState(null);
  const [errorExist, setErrorExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setMealData(value);
  };

  const parseResponse = (apiResponse) => {
    const instructions = apiResponse.recipe.instructions;

    const ingredients = Object.values(apiResponse.recipe.ingredients).join(
      ", "
    );

    return (
      <div>
        <p key={apiResponse.recipe.meal.name}>{apiResponse.recipe.meal.name}</p>
        <p key={apiResponse.recipe.meal.nam + "i"}>
          Ingredients: {ingredients}
        </p>
        <p key={apiResponse.recipe.meal.nam + "ri"}>Recipe instructions:</p>
        <ul>
          {instructions.map((instruction) => (
            <li key={apiResponse.recipe.meal.nam + instruction}>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mealData) {
        setLoading(true);
        const apiResponse = await ApiService.getRecipe(mealData);
        setLoading(false);
        setResponse(parseResponse(apiResponse));
        setErrorExist(false);
      }
    } catch (error) {
      setResponse(error);
      setErrorExist(true);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        minHeight: "100vh",
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={6} className="custom-form-container" elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Find recipe!
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Dish or or food product"
                  name="meal"
                  variant="outlined"
                  value={mealData}
                  onChange={handleChange}
                  color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="inherit"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      {!response && loading && (
        <div
          elevation={3}
          className="custom-response"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography className="basic-response">
            The preparation of a recipe for you is underway...
          </Typography>{" "}
          <CircularProgress color="success" />{" "}
        </div>
      )}
      {response && (
        <div elevation={3} className="custom-response">
          {!errorExist && (
            <Typography variant="h6" align="center">
              Recipe for {mealData}
            </Typography>
          )}
          {!errorExist && (
            <Typography
              className="basic-response"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {response}
            </Typography>
          )}
          {errorExist && (
            <div variant="body1" style={{ color: "red" }}>
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealRecipeForm;
