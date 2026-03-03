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
    if (!userData) return alert("Please login first");

    const user = JSON.parse(userData);

    try {
      const { data } = await axios.post(getTransactions, {
        userId: user._id,
        frequency: "365",
        type: "all",
      });

      const transactions = data.transactions || [];

      if (transactions.length === 0) {
        alert("No transactions to download!");
        return;
      }

      // Convert transactions to worksheet
      const worksheet = XLSX.utils.json_to_sheet(transactions);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      // Generate buffer
      XLSX.writeFile(workbook, "CoinFlow_Transactions.xlsx");
    } catch (err) {
      console.error(err);
      alert("Failed to download Excel");
    }
  };

  return (
    <div className="navbar">
      <h4>Coin-Flow</h4>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <button onClick={handleDownload} style={btnStyle}>
          Download Excel
        </button>
        <Link to="/about">About Us</Link>
        <button onClick={handleLogout} style={btnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Simple inline button style to match link appearance
const btnStyle = {
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontWeight: 500,
  textDecoration: "none",
};

export default Navbar;