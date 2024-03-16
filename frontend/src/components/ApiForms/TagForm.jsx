import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import ApiService from "../../services/ApiService";
import backgroundImage from "../../utils/eggs.jpg";
import CircularProgress from "@mui/material/CircularProgress";

const TagForm = () => {
  const [response, setResponse] = useState(null);
  const [errorExist, setErrorExist] = useState(false);
  const [loading, setLoading] = useState(false);

  const parseResponse = (apiResponse) => {
    const tagNames = Object.values(apiResponse.tags).map((tag) => tag.name);
    return tagNames.join(", ");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const apiResponse = await ApiService.getMealTags();
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
            Find food tags!
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
          >
            Find
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
            The searching for tags is underway...
          </Typography>{" "}
          <CircularProgress color="success" />{" "}
        </div>
      )}
      {response && (
        <div elevation={3} className="custom-response">
          {!errorExist && (
            <Typography variant="h6" align="center">
              Food & Dish Tags
            </Typography>
          )}
          {!errorExist && (
            <Typography
              className="basic-response"
              style={{ display: "flex", flexDirection: "row" }}
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

export default TagForm;
