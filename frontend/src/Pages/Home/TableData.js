import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const TableData = ({ data, user }) => {

const [show, setShow] = useState(false);
const [transactions, setTransactions] = useState([]);
const [editingTransaction, setEditingTransaction] = useState(null);
const [currId, setCurrId] = useState(null);

const [values, setValues] = useState({
title: "",
amount: "",
description: "",
category: "",
date: "",
transactionType: "",
});

const handleClose = () => {
setShow(false);
setEditingTransaction(null);
};

const handleShow = () => setShow(true);

useEffect(() => {
setTransactions(data);
}, [data]);

/* ============================= /
/ EDIT TRANSACTION /
/ ============================= */

const handleEditClick = (item) => {

setCurrId(item._id);

setEditingTransaction(item);

setValues({
  title: item.title,
  amount: item.amount,
  description: item.description,
  category: item.category,
  date: item.date?.substring(0,10),
  transactionType: item.transactionType,
});

handleShow();

};

const handleEditSubmit = async () => {

try{

  const { data } = await axios.put(`${editTransactions}/${currId}`,{
    ...values
  });

  if(data.success){
    window.location.reload();
  }

}catch(err){
  console.log(err);
}

};

/* ============================= /
/ DELETE TRANSACTION /
/ ============================= */

const handleDeleteClick = async (id) => {

try{

  const { data } = await axios.post(`${deleteTransactions}/${id}`,{
    userId: user._id
  });

  if(data.success){
    window.location.reload();
  }

}catch(err){
  console.log(err);
}

};

const handleChange = (e) => {
setValues({
...values,
[e.target.name]: e.target.value
});
};

/* ============================= */

return (
<Container>

  <Table responsive="md" className="data-table">

    <thead>
      <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Category</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody className="text-white">

      {transactions.map((item) => (

        <tr key={item._id}>

          <td>{moment(item.date).format("YYYY-MM-DD")}</td>

          <td>{item.title}</td>

          <td>₹ {item.amount}</td>

          <td style={{
            color: item.transactionType === "income"
            ? "#2ecc71"
            : "#ff4d4d"
          }}>
            {item.transactionType}
          </td>

          <td>{item.category}</td>

          <td>

            <div className="icons-handle">

              <EditNoteIcon
                sx={{ cursor:"pointer" }}
                onClick={() => handleEditClick(item)}
              />

              <DeleteForeverIcon
                sx={{ color:"red", cursor:"pointer" }}
                onClick={() => handleDeleteClick(item._id)}
              />

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </Table>

  {/* ============================= */}
  {/* EDIT MODAL */}
  {/* ============================= */}

  {editingTransaction && (

    <Modal show={show} onHide={handleClose} centered>

      <Modal.Header closeButton>
        <Modal.Title>
          Update Transaction
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={values.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>

            <Form.Select
              name="category"
              value={values.category}
              onChange={handleChange}
            >

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
            <Form.Label>Transaction Type</Form.Label>

            <Form.Select
              name="transactionType"
              value={values.transactionType}
              onChange={handleChange}
            >

              <option value="income">Income</option>
              <option value="expense">Expense</option>

            </Form.Select>

          </Form.Group>

          <Form.Group className="mb-3">
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

        <Button variant="primary" onClick={handleEditSubmit}>
          Update
        </Button>

      </Modal.Footer>

    </Modal>

  )}

</Container>

);

};

export default TableData;