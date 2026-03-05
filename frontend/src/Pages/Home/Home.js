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

  const handleStartChange = (date) => setStartDate(date);
  const handleEndChange = (date) => setEndDate(date);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* Check user login */
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    setcUser(JSON.parse(userData));
    setRefresh(true);
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
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

  const handleReset = () => {
    setType("all");
    setFrequency("7");
    setStartDate(null);
    setEndDate(null);
  };

  /* Fetch transactions */
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

  const handleTableClick = () => setView("table");
  const handleChartClick = () => setView("chart");

  return (
    <>
      <Navbar />

      <Container fluid style={{ marginTop: "90px", minHeight: "100vh", padding: "20px" }}>

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

          <div className="text-white type">
            <Form.Group>
              <Form.Label>Type</Form.Label>

              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="expense">Expense</option>
                <option value="credit">Earned</option>
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

        {frequency === "custom" && (
          <div className="date">

            <div className="form-group">
              <label className="text-white">Start Date:</label>

              <DatePicker
                selected={startDate}
                onChange={handleStartChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />

            </div>

            <div className="form-group">
              <label className="text-white">End Date:</label>

              <DatePicker
                selected={endDate}
                onChange={handleEndChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />

            </div>

          </div>
        )}

        <div className="containerBtn">
          <Button variant="primary" onClick={handleReset}>
            Reset Filter
          </Button>
        </div>

        {loading && <Spinner />}

        {!loading && view === "table" && (
          <TableData data={transactions} user={cUser} />
        )}

        {!loading && view === "chart" && (
          <Analytics transactions={transactions} user={cUser} />
        )}

        <ToastContainer />

      </Container>

      {/* Add Transaction Modal */}

      <Modal show={show} onHide={handleClose} centered>

        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group>
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group>
              <Form.Label>Amount</Form.Label>

              <Form.Control
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onChange={handleChange}
              />

            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>

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

            <Form.Group>
              <Form.Label>Transaction Type</Form.Label>

              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
              >

                <option value="">Choose...</option>
                <option value="credit">Credit</option>
                <option value="expense">Expense</option>

              </Form.Select>

            </Form.Group>

            <Form.Group>
              <Form.Label>Date</Form.Label>

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