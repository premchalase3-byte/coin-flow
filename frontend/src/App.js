import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Register";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";   // ✅ ADD THIS

function App() {
  const user = localStorage.getItem("user");

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* ✅ ADD ABOUT ROUTE */}
        <Route
          path="/about"
          element={user ? <About /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;