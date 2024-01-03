import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Login from "./components/screens/Login";
import Add from "./components/screens/Add";
import Recipes from "./components/screens/Recipes";
import RecipesDetailed from "./components/screens/RecipesDetailed";
import SignUp from "./components/screens/SignUp";
import Update from "./components/screens/Update";
import React from "react";


function App() {


  const handleLogin = (newToken,refreshToken) => {
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('refreshToken',refreshToken)
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="recipes/" element={<Recipes />} />
        <Route path="recipe_detailed/:id" element={<RecipesDetailed />} />
        <Route path="update/:id" element={<Update />} />
        <Route path="sign_up" element={<SignUp onLogin={handleLogin} />} />
        <Route path="add" element={<Add />} />
      </Routes>
    </Router>
  );
}

export default App;
