import express from 'express';
import {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  updateTransactionController
} from '../controllers/transactionController.js';

const router = express.Router();

// Add Transaction
router.route("/addTransaction").post(addTransactionController);

// Get All Transactions
router.route("/getTransaction").post(getAllTransactionController);

// Delete Transaction
router.route("/deleteTransaction/:id").post(deleteTransactionController);

// Update Transaction
router.route("/updateTransaction/:id").put(updateTransactionController);

export default router;