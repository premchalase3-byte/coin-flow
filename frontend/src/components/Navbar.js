import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import * as XLSX from "xlsx";
import { getTransactions } from "../utils/ApiRequest";
import axios from "axios";

/*
  Global Action Loader Events

  Navbar sends loading events to App.js.
  App.js listens and displays ActionLoader.
*/

const showActionLoader = (text) => {
  window.dispatchEvent(
    new CustomEvent("coinflow:action-loading", {
      detail: {
        loading: true,
        text,
      },
    })
  );
};

const hideActionLoader = () => {
  window.dispatchEvent(
    new CustomEvent("coinflow:action-loading", {
      detail: {
        loading: false,
      },
    })
  );
};

const Navbar = () => {

  const navigate = useNavigate();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* ================================= */
  /* LOGOUT */
  /* ================================= */

  const handleLogout = () => {

    if (isLoggingOut) return;

    setIsLoggingOut(true);

    showActionLoader("Logging out...");

    // Remove user session
    localStorage.removeItem("user");

    /*
      Small delay so the loader animation
      can actually be seen.
    */

    setTimeout(() => {

      navigate("/login", {
        replace: true,
      });

      /*
        Force UI refresh so the application
        completely resets its authenticated state.
      */

      window.location.reload();

    }, 500);

  };

  /* ================================= */
  /* EXCEL DOWNLOAD */
  /* ================================= */

  const handleDownload = async () => {

    if (isDownloading) return;

    const userData = localStorage.getItem("user");

    if (!userData) {

      alert("Please login first");

      return;
    }

    const user = JSON.parse(userData);

    try {

      setIsDownloading(true);

      showActionLoader("Preparing Excel...");

      /*
        Fetch transactions
      */

      const { data } = await axios.post(
        getTransactions,
        {
          userId: user._id,
          frequency: "365",
          type: "all",
        }
      );

      const transactions = data.transactions || [];

      /*
        No transactions
      */

      if (transactions.length === 0) {

        hideActionLoader();

        alert("No transactions to download!");

        setIsDownloading(false);

        return;
      }

      /*
        Create worksheet
      */

      const worksheet =
        XLSX.utils.json_to_sheet(transactions);

      /*
        Create workbook
      */

      const workbook =
        XLSX.utils.book_new();

      /*
        Add worksheet
      */

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Transactions"
      );

      /*
        Generate Excel file
      */

      XLSX.writeFile(
        workbook,
        "CoinFlow_Transactions.xlsx"
      );

      /*
        Small delay so the user
        can see the completed action.
      */

      setTimeout(() => {

        hideActionLoader();

        setIsDownloading(false);

      }, 400);

    } catch (error) {

      console.error(
        "Excel download error:",
        error
      );

      hideActionLoader();

      setIsDownloading(false);

      alert("Failed to download Excel");

    }

  };

  /* ================================= */
  /* DASHBOARD NAVIGATION */
  /* ================================= */

  const handleDashboardClick = (e) => {

    /*
      Prevent unnecessary loader if
      already on Dashboard.
    */

    if (window.location.pathname === "/") {

      e.preventDefault();

      return;
    }

    e.preventDefault();

    showActionLoader("Opening Dashboard...");

    setTimeout(() => {

      navigate("/");

    }, 250);

  };

  /* ================================= */
  /* ABOUT NAVIGATION */
  /* ================================= */

  const handleAboutClick = (e) => {

    /*
      Prevent unnecessary loader if
      already on About page.
    */

    if (window.location.pathname === "/about") {

      e.preventDefault();

      return;
    }

    e.preventDefault();

    showActionLoader("Opening About Us...");

    setTimeout(() => {

      navigate("/about");

    }, 250);

  };

  /* ================================= */
  /* CLEANUP LOADER WHEN COMPONENT
     UNMOUNTS
  ================================= */

  useEffect(() => {

    return () => {

      hideActionLoader();

    };

  }, []);

  /* ================================= */
  /* UI */
  /* ================================= */

  return (

    <div className="navbar">

      {/* ============================= */}
      {/* LOGO */}
      {/* ============================= */}

      <div className="logo">
        Coin-Flow
      </div>

      {/* ============================= */}
      {/* NAVIGATION LINKS */}
      {/* ============================= */}

      <div className="nav-links">

        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ========================= */}

        <Link
          to="/"
          onClick={handleDashboardClick}
        >
          Dashboard
        </Link>

        {/* ========================= */}
        {/* DOWNLOAD EXCEL */}
        {/* ========================= */}

        <button
          className="logout-btn"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading
            ? "Preparing..."
            : "Download Excel"}
        </button>

        {/* ========================= */}
        {/* ABOUT */}
        {/* ========================= */}

        <Link
          to="/about"
          onClick={handleAboutClick}
        >
          About Us
        </Link>

        {/* ========================= */}
        {/* LOGOUT */}
        {/* ========================= */}

        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut
            ? "Logging out..."
            : "Logout"}
        </button>

      </div>

    </div>

  );

};

export default Navbar;