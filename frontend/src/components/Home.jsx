import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../utils/meat.jpg";

const buttonStyle = {
  backgroundColor: "#00000099",
  color: "#ffffff",
  fontSize: "1.2rem",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
};

const Home = () => {
  return (
    <div
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "repeat",
      height: "100vh",
    }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "10vh",
          padding: "0 2rem",
        }}
      >
        <Link to="/recipe">
          <button className="home-button" style={buttonStyle}>
            RECIPE
          </button>
        </Link>
        <Link to="/nutrition">
          <button style={buttonStyle}>NUTRITION</button>
        </Link>
        <Link to="/ingredients">
          <button style={buttonStyle}>INGREDIENTS</button>
        </Link>
        <Link to="/inspiration">
          <button style={buttonStyle}>INSPIRATION</button>
        </Link>
        <Link to="/similar">
          <button style={buttonStyle}>SIMILAR DISHES</button>
        </Link>
        <Link to="/tags">
          <button style={buttonStyle}>TAGS</button>
        </Link>
      </nav>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          PLATE PICKER
        </h2>
        <p
          style={{
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            fontSize: "1.5rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Real Specialty Of Food
        </p>
        <p
          style={{
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            fontSize: "1.2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Struggling to decide what to eat? Need inspiration for your next meal?
          PlatePicker is the perfect app for you! Discover a variety of dinner
          ideas, explore calorie and nutrient content, and even plan your daily
          diet effortlessly. Check out what we have for you and make mealtime
          decisions a breeze!
        </p>
        <Link to="/plan">
          <button style={buttonStyle}>PLAN DAY DIET</button>
        </Link>
      </main>
      <footer
        style={{
          backgroundColor: "#00000091",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ color: "#ffffff", fontFamily: "Arial, sans-serif" }}>
          © 2024 PLATE PICKER WEBSITE. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
