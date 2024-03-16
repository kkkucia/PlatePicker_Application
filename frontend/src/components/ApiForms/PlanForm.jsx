import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import ApiService from "../../services/ApiService";
import backgroundImage from "../../utils/rice.jpg";
import CircularProgress from "@mui/material/CircularProgress";

const PlanForm = () => {
  const [response, setResponse] = useState(null);
  const [errorExist, setErrorExist] = useState(false);
  const [loading, setLoading] = useState(false);

  const parseResponse = (apiResponse) => {
    let idx = 0;
    const planMeals = Object.keys(apiResponse.plan);
    return (
      <div>
        {Object.values(apiResponse.plan).map((m, index) => (
          <>
            <ul key={m.meal.id}>
              <b>{planMeals[idx++]}</b>: {m.meal.name}
            </ul>
            <p key={1}></p>
            <li key={m.meal.id + "d"}>
              <b>Description: </b>
              {m.meal.description}
            </li>
            <p key={2}></p>
            <li key={m.meal.id + "r"}>
              <b>Recipe: </b>
              {m.instructions.join(" ")}
            </li>
            <p key={3}></p>
            <li key={m.meal.id + "n"}>
              <b>Nutrition of products: </b>
              <ul>
                {Object.values(m.nutrition_of_products).map((n) =>
                  n.quantity !== 0 ? (
                    <li
                      key={n.name + m.meal.id}
                      style={{ listStyleType: "none" }}
                    >
                      {n.name} ({n.label}): {n.quantity.toFixed(2)} {n.unit}
                    </li>
                  ) : null
                )}
              </ul>
            </li>
          </>
        ))}
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const apiResponse = await ApiService.getMealsPlanForAllDay();
      setLoading(false);
      setResponse(parseResponse(apiResponse));
      setErrorExist(false);
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
            Get a diet for the whole day!
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
          >
            See what fate brings you!
          </Button>
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
            The preparation of a nutrition plan for you is underway...
          </Typography>{" "}
          <CircularProgress color="success" />{" "}
        </div>
      )}
      {response && (
        <div elevation={3} className="custom-response">
          <Typography variant="h6" align="center">
            Genereted Diet Plan
          </Typography>
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

export default PlanForm;
