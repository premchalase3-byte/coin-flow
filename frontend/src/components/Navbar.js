// src/components/Navbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import * as XLSX from "xlsx";
import { getTransactions } from "../utils/ApiRequest";
import axios from "axios";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDownload = async () => {

    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(userData);

    try {

      const { data } = await axios.post(getTransactions,{
        userId: user._id,
        frequency: "365",
        type: "all",
      });

      const transactions = data.transactions || [];

      if(transactions.length === 0){
        alert("No transactions to download!");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(transactions);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      XLSX.writeFile(workbook,"CoinFlow_Transactions.xlsx");

    } catch (error) {

      console.error(error);
      alert("Failed to download Excel");

    }

  };

  return (

    <div className="navbar">

      <div className="logo">
        Coin-Flow
      </div>

      <div className="nav-links">

        <Link to="/">Dashboard</Link>

        <button
          className="logout-btn"
          onClick={handleDownload}
        >
          Download Excel
        </button>

        <Link to="/about">About Us</Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>

  );

};

export default Navbar;