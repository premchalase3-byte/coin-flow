import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const [cUser, setcUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [view] = useState("table");

  // Check if user logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    setcUser(JSON.parse(userData));
    setRefresh(true);
  }, [navigate]);

  // Fetch transactions
  useEffect(() => {
    if (!cUser) return;

    const fetchTransactions = async () => {
      setLoading(true);

      try {
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
        });

        setTransactions(data.transactions || []);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [refresh, cUser]);

  return (
    <>
      <Navbar />

      <Container
        fluid
        style={{ marginTop: "90px", minHeight: "100vh", padding: "20px" }}
      >
        {loading && <Spinner />}

        {!loading && view === "table" && (
          <TableData data={transactions} user={cUser} />
        )}

        {!loading && view === "chart" && (
          <Analytics transactions={transactions} user={cUser} />
        )}

        <ToastContainer />
      </Container>
    </>
  );
};

export default Home;