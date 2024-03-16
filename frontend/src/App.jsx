import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import LoginWrapper from "./components/LoginPage/LoginWrapper";
import NavBar from "./components/NavBar";
import AuthService from "./services/AuthService";
import Home from "./components/Home";
import MealIngredientsForm from "./components/ApiForms/MealIngridientsForm";
import MealInspirationForm from "./components/ApiForms/MealInspirationForm";
import MealRecipeForm from "./components/ApiForms/MealRecipeForm";
import NutritionForm from "./components/ApiForms/NutritionForm";
import SimilarMealsForm from "./components/ApiForms/SimilarMealsForm";
import TagForm from "./components/ApiForms/TagForm";
import PlanForm from "./components/ApiForms/PlanForm";
import RegisterWrapper from "./components/LoginPage/RegisterWrapper";

function App() {
  const [isLogIn, setLogStatus] = useState(false);

  const checkLogin = () => {
    return AuthService.getToken() !== null;
  };

  useEffect(() => {
    const isLoggedIn = checkLogin();
    setLogStatus(isLoggedIn);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar isLogIn={isLogIn} />
        <Routes>
          <Route path="/" element={!isLogIn && <LoginWrapper />} />
          <Route
            path="/registration"
            element={!isLogIn && <RegisterWrapper />}
          />
          <Route path="/home" element={isLogIn && <Home />} />
          <Route path="/nutrition" element={isLogIn && <NutritionForm />} />
          <Route path="/similar" element={isLogIn && <SimilarMealsForm />} />
          <Route path="/recipe" element={isLogIn && <MealRecipeForm />} />
          <Route
            path="/inspiration"
            element={isLogIn && <MealInspirationForm />}
          />
          <Route
            path="/ingredients"
            element={isLogIn && <MealIngredientsForm />}
          />
          <Route path="/tags" element={isLogIn && <TagForm />} />
          <Route path="/plan" element={isLogIn && <PlanForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
