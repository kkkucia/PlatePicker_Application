import React from "react";
import { TextField, Button, Grid } from "@mui/material";

const LoginForm = ({ label, userData, handleChange, handleLoginSubmit }) => {
  return (
    <form onSubmit={handleLoginSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            value={userData.username}
            onChange={handleChange}
            color="success"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            color="success"
            value={userData.password}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" fullWidth variant="contained" color="inherit">
            {label}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;
