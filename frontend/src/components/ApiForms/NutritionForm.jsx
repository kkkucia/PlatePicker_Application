import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import ApiService from "../../services/ApiService";
import backgroundImage from "../../utils/springRolls.jpg";
import CircularProgress from "@mui/material/CircularProgress";

const NutritionForm = () => {
  const [response, setResponse] = useState(null);
  const [errorExist, setErrorExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState({
    meal: "",
    quantity: 1,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNutritionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseResponse = (apiResponse) => {
    return (
      <div>
        {Object.values(apiResponse.nutrition).map((n) =>
          n.quantity !== 0 ? (
            <p key={n.name}>
              <b>{n.name}</b> ({n.label}): {n.quantity.toFixed(2)} {n.unit}
            </p>
          ) : null
        )}
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (nutritionData.meal && nutritionData.quantity) {
        setLoading(true);
        const apiResponse = await ApiService.getMealNutrition(
          nutritionData.meal,
          nutritionData.quantity
        );
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
            Check the nutritional values of the dish!
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
                  value={nutritionData.meal}
                  onChange={handleChange}
                  color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  variant="outlined"
                  color="success"
                  value={nutritionData.quantity}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: 1,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="inherit"
                >
                  Show nutrition
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
            The preparation of a nutrition is underway...
          </Typography>{" "}
          <CircularProgress color="success" />{" "}
        </div>
      )}
      {response && (
        <div elevation={3} className="custom-response">
          {!errorExist && (
            <Typography variant="h6" align="center">
              Nutrition information for {nutritionData.quantity}{" "}
              {nutritionData.meal}
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

export default NutritionForm;
