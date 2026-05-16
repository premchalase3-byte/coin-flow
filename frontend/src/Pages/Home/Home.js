import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AIChatbot from "../../components/AIChatbot";
import AIInsights from "../../components/AIInsights";
import DottedSurface from "../../components/DottedSurface";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";

import "./home.css";

const Home = () => {

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const [cUser, setcUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [view, setView] = useState("table");
  const [show, setShow] = useState(false);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  /* ========================= */
  /* Dashboard Stats */
  /* ========================= */

  const totalIncome = transactions
    .filter((t) => t.transactionType === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  const totalTransactions = transactions.length;

  /* ========================= */

  const handleStartChange = (date) => setStartDate(date);
  const handleEndChange = (date) => setEndDate(date);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* ========================= */
  /* Check Login */
  /* ========================= */

  useEffect(() => {

    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    setcUser(JSON.parse(userData));
    setRefresh(true);

  }, [navigate]);

  /* ========================= */

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  /* ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      title,
      amount,
      description,
      category,
      date,
      transactionType
    } = values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all fields", toastOptions);
      return;
    }

    setLoading(true);

    try {

      const { data } = await axios.post(addTransaction, {
        ...values,
        userId: cUser._id,
      });

      if (data.success) {

        toast.success(data.message, toastOptions);

        setShow(false);

        setValues({
          title: "",
          amount: "",
          description: "",
          category: "",
          date: "",
          transactionType: "",
        });

        setRefresh(!refresh);

      } else {

        toast.error(data.message, toastOptions);

      }

    } catch (err) {

      toast.error("Something went wrong!", toastOptions);

    }

    setLoading(false);

  };

  /* ========================= */

  const handleReset = () => {
    setType("all");
    setFrequency("7");
    setStartDate(null);
    setEndDate(null);
  };

  /* ========================= */
  /* Fetch Transactions */
  /* ========================= */

  useEffect(() => {

    if (!cUser) return;

    const fetchTransactions = async () => {

      setLoading(true);

      try {

        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency,
          startDate,
          endDate,
          type,
        });

        setTransactions(data.transactions || []);

      } catch (err) {

        console.error(err);

      }

      setLoading(false);

    };

    fetchTransactions();

  }, [refresh, cUser, frequency, startDate, endDate, type]);

  /* ========================= */

  const handleTableClick = () => setView("table");
  const handleChartClick = () => setView("chart");

  /* ========================= */

  return (

    <>

      {/* 🔥 Animated Background */}
      <DottedSurface />

      <Navbar />

      <Container
        fluid
        style={{
          marginTop: "90px",
          minHeight: "100vh",
          padding: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >

        {/* ========================= */}
        {/* STAT CARDS */}
        {/* ========================= */}

        <div className="stats-container">

          <div className="stat-card income">
            <h5>Total Income</h5>
            <h3>₹ {totalIncome}</h3>
          </div>

          <div className="stat-card expense">
            <h5>Total Expense</h5>
            <h3>₹ {totalExpense}</h3>
          </div>

          <div className="stat-card balance">
            <h5>Balance</h5>
            <h3>₹ {totalBalance}</h3>
          </div>

          <div className="stat-card transactions">
            <h5>Total Transactions</h5>
            <h3>{totalTransactions}</h3>
          </div>

        </div>

        {/* ========================= */}
        {/* AI INSIGHTS */}
        {/* ========================= */}

        <AIInsights transactions={transactions} />

        {/* ========================= */}
        {/* FILTER SECTION */}
        {/* ========================= */}

        <div className="filterRow">

          <div className="text-white">

            <Form.Group>

              <Form.Label>Select Frequency</Form.Label>

              <Form.Select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="7">Last Week</option>
                <option value="30">Last Month</option>
                <option value="365">Last Year</option>
                <option value="custom">Custom</option>
              </Form.Select>

            </Form.Group>

          </div>

          <div className="text-white">

            <Form.Group>

              <Form.Label>Type</Form.Label>

              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>

            </Form.Group>

          </div>

          <div className="iconBtnBox">

            <FormatListBulletedIcon
              onClick={handleTableClick}
              className={view === "table" ? "iconActive" : "iconDeactive"}
            />

            <BarChartIcon
              onClick={handleChartClick}
              className={view === "chart" ? "iconActive" : "iconDeactive"}
            />

          </div>

          <div>

            <Button onClick={handleShow} className="addNew">
              Add New
            </Button>

            <Button onClick={handleShow} className="mobileBtn">
              +
            </Button>

          </div>

        </div>

        {/* ========================= */}
        {/* CUSTOM DATE */}
        {/* ========================= */}

        {frequency === "custom" && (

          <div className="date">

            <div className="form-group">

              <label className="text-white">
                Start Date:
              </label>

              <DatePicker
                selected={startDate}
                onChange={handleStartChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
              />

            </div>

            <div className="form-group">

              <label className="text-white">
                End Date:
              </label>

              <DatePicker
                selected={endDate}
                onChange={handleEndChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
              />

            </div>

          </div>

        )}

        {/* ========================= */}
        {/* RESET BUTTON */}
        {/* ========================= */}

        <div className="containerBtn">

          <Button variant="primary" onClick={handleReset}>
            Reset Filter
          </Button>

        </div>

        {/* ========================= */}
        {/* LOADER */}
        {/* ========================= */}

        {loading && <Spinner />}

        {/* ========================= */}
        {/* TABLE VIEW */}
        {/* ========================= */}

        {!loading && view === "table" && (

          <div className="table-container">
            <TableData data={transactions} user={cUser} />
          </div>

        )}

        {/* ========================= */}
        {/* CHART VIEW */}
        {/* ========================= */}

        {!loading && view === "chart" && (

          <div className="analytics-card">
            <Analytics transactions={transactions} />
          </div>

        )}

        <ToastContainer />

      </Container>

      {/* ========================= */}
      {/* FLOATING CHATBOT */}
      {/* ========================= */}

      <AIChatbot transactions={transactions} />

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}

      <Modal show={show} onHide={handleClose} centered>

        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Title
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={values.title}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Amount
              </Form.Label>

              <Form.Control
                type="number"
                placeholder="Enter amount"
                name="amount"
                value={values.amount}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Description
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={values.description}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Category
              </Form.Label>

              <Form.Select
                name="category"
                value={values.category}
                onChange={handleChange}
              >

                <option value="">Choose...</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>

              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Transaction Type
              </Form.Label>

              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
              >

                <option value="">Choose...</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>

              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label className="text-white">
                Date
              </Form.Label>

              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>

        </Modal.Footer>

      </Modal>

    </>

  );

};

export default Home;