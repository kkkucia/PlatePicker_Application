import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import Login from "./Login";

const RegisterWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [registerInfo, setRegisterInfo] = useState("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthService.registerUser(userData);
      setRegisterInfo("");
      navigate("/");
    } catch (error) {
      setRegisterInfo(error);
    }
  };

  return (
    <Login
      label={"Registration"}
      question={"Have an account? "}
      answer={"Log in!"}
      link={"/"}
      info={registerInfo}
      userData={userData}
      setUserData={setUserData}
      handleLoginSubmit={handleRegisterSubmit}
    />
  );
};

export default RegisterWrapper;
