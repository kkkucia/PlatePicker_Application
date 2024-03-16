import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import Login from "./Login";

const LoginWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [logInfo, setLogInfo] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthService.loginUser(userData);
      setLogInfo("");
      navigate("/home");
      window.location.reload();
    } catch (error) {
      setLogInfo(error);
    }
  };

  return (
    <Login
      label={"Log in"}
      question={"Don't have an account? "}
      answer={"Sign in!"}
      link={"/registration"}
      info={logInfo}
      userData={userData}
      setUserData={setUserData}
      handleLoginSubmit={handleLoginSubmit}
    />
  );
};

export default LoginWrapper;
