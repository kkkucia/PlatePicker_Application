import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const NavBar = ({ isLogIn }) => {
  const navigate = useNavigate();

  const handleLoginOutSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthService.logoutUser();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleHomeClick = async (event) => {
    event.preventDefault();
    try {
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.98)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 20,
          paddingRight: 10,
        }}
      >
        <Typography
          component="div"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <RestaurantIcon style={{ fontSize: "26px", marginRight: "8px" }} />
          <p style={{ fontSize: "24px" }}> PlatePicker </p>
        </Typography>
        <div>
          {isLogIn && (
            <Button
              onClick={handleHomeClick}
              style={{ fontSize: "22px" }}
              color="inherit"
            >
              HOME
            </Button>
          )}
          {isLogIn && (
            <Button
              onClick={handleLoginOutSubmit}
              style={{ fontSize: "22px" }}
              color="inherit"
            >
              Login page
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
