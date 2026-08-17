import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import FloatingBrand from "./components/FloatingBrand";
import LoadingScreen from "./components/LoadingScreen";
import ActionLoader from "./components/ActionLoader";

import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Register";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";

/* ========================================= */
/* NAVIGATION LOADER */
/* ========================================= */

const NavigationLoader = ({
  setActionLoading,
  setActionLoadingText,
}) => {

  const location = useLocation();

  useEffect(() => {

    /*
      Show loader whenever the URL changes.

      A small delay makes the transition visible
      without keeping the user waiting for long.
    */

    setActionLoadingText("Loading page...");
    setActionLoading(true);

    const timer = setTimeout(() => {
      setActionLoading(false);
    }, 450);

    return () => {
      clearTimeout(timer);
    };

  }, [
    location.pathname,
    setActionLoading,
    setActionLoadingText,
  ]);

  return null;
};

/* ========================================= */
/* MAIN APP CONTENT */
/* ========================================= */

const AppContent = ({
  actionLoading,
  actionLoadingText,
  setActionLoading,
  setActionLoadingText,
}) => {

  const user = localStorage.getItem("user");

  return (
    <>

      {/* ================================= */}
      {/* SMALL ACTION / PAGE LOADER */}
      {/* ================================= */}

      {actionLoading && (
        <ActionLoader
          text={actionLoadingText}
        />
      )}

      {/* ================================= */}
      {/* ROUTE CHANGE DETECTOR */}
      {/* ================================= */}

      <NavigationLoader
        setActionLoading={setActionLoading}
        setActionLoadingText={setActionLoadingText}
      />

      {/* ================================= */}
      {/* ROUTES */}
      {/* ================================= */}

      <Routes>

        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            user ? (
              <Home />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* ========================= */}
        {/* LOGIN */}
        {/* ========================= */}

        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />

        {/* ========================= */}
        {/* REGISTRATION */}
        {/* ========================= */}

        <Route
          path="/signup"
          element={
            !user ? (
              <Signup />
            ) : (
              <Navigate
                to="/"
                replace
              />
            )
          }
        />

        {/* ========================= */}
        {/* ABOUT */}
        {/* ========================= */}

        <Route
          path="/about"
          element={
            user ? (
              <About />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* ========================= */}
        {/* UNKNOWN ROUTE */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      {/* ================================= */}
      {/* FLOATING PREM'S BRAND */}
      {/* ================================= */}

      <FloatingBrand />

    </>
  );
};

/* ========================================= */
/* APP */
/* ========================================= */

function App() {

  /* ========================================= */
  /* INITIAL WEBSITE LOADER */
  /* ========================================= */

  const [isLoading, setIsLoading] = useState(true);

  /* ========================================= */
  /* ACTION / NAVIGATION LOADER */
  /* ========================================= */

  const [actionLoading, setActionLoading] = useState(false);

  const [
    actionLoadingText,
    setActionLoadingText,
  ] = useState("Loading...");

  /* ========================================= */
  /* LISTEN FOR GLOBAL ACTION LOADER EVENTS */
  /* ========================================= */

  useEffect(() => {

    const handleActionLoading = (event) => {

      const {
        loading,
        text,
      } = event.detail || {};

      /*
        Update loader text if provided.
      */

      if (text) {
        setActionLoadingText(text);
      }

      /*
        Show or hide the loader.
      */

      setActionLoading(
        Boolean(loading)
      );

    };

    /*
      Listen for events coming from:
      Navbar.js
      and other components.
    */

    window.addEventListener(
      "coinflow:action-loading",
      handleActionLoading
    );

    /*
      Cleanup listener when App unmounts.
    */

    return () => {

      window.removeEventListener(
        "coinflow:action-loading",
        handleActionLoading
      );

    };

  }, []);

  /* ========================================= */
  /* STARTUP LOADER FINISH */
  /* ========================================= */

  const handleLoadingFinish = useCallback(() => {

    setIsLoading(false);

  }, []);

  /* ========================================= */
  /* RENDER */
  /* ========================================= */

  return (
    <>

      {/* ================================= */}
      {/* INITIAL WEBSITE LOADING SCREEN */}
      {/* ================================= */}

      {isLoading && (
        <LoadingScreen
          onFinish={handleLoadingFinish}
        />
      )}

      {/* ================================= */}
      {/* ROUTER */}
      {/* ================================= */}

      <Router>

        <AppContent
          actionLoading={actionLoading}
          actionLoadingText={actionLoadingText}
          setActionLoading={setActionLoading}
          setActionLoadingText={setActionLoadingText}
        />

      </Router>

    </>
  );
}

export default App;