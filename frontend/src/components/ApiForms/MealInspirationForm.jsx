import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import ApiService from "../../services/ApiService";
import backgroundImage from "../../utils/plates.jpg";
import CircularProgress from "@mui/material/CircularProgress";

const MealInspirationForm = () => {
  const [response, setResponse] = useState(null);
  const [errorExist, setErrorExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inspirationData, setInspirationData] = useState({
    searchQuery: "",
    tag: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInspirationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseResponse = (apiResponse) => {
    return apiResponse.inspiration.meals.map((meal) => {
      return <p key={meal.name}>{meal.name}</p>;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (inspirationData.searchQuery || inspirationData.tag) {
        setLoading(true);
        let apiResponse = null;
        if (!inspirationData.tag) {
          apiResponse = await ApiService.getMealInspiration(
            inspirationData.searchQuery
          );
        } else {
          apiResponse = await ApiService.getMealInspiration(
            inspirationData.searchQuery,
            inspirationData.tag
          );
        }
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
            Inspire yourself with food!
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Dish or or food product"
                  name="searchQuery"
                  variant="outlined"
                  value={inspirationData.searchQuery}
                  onChange={handleChange}
                  color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tag for dish or food product"
                  name="tag"
                  variant="outlined"
                  value={inspirationData.tag}
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
            The inspiration for you is underway...
          </Typography>{" "}
          <CircularProgress color="success" />{" "}
        </div>
      )}
      {response && (
        <div elevation={3} className="custom-response">
          {!errorExist && (
            <Typography variant="h6" align="center">
              Inspirations
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

export default MealInspirationForm;
