import React from "react";
import { Grid, Typography, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginForm from "./LoginForm";
import "../../styles/App.css";
import backgroundImage from "../../utils/sushi2.jpg";

const Login = ({
  label,
  question,
  answer,
  link,
  info,
  userData,
  setUserData,
  handleLoginSubmit,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        <Grid item xs={6} className="custom-container" elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            <LockOutlinedIcon /> {label}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            style={{ color: "red" }}
            gutterBottom
          >
            {info}
          </Typography>
          <LoginForm
            label={label}
            userData={userData}
            handleChange={handleChange}
            handleLoginSubmit={handleLoginSubmit}
          />
          <Grid item xs={12}>
            <Typography align="center" style={{ marginTop: 16 }}>
              {question}
              <Link color="rgb(46, 125, 50)" href={link}>
                {answer}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
