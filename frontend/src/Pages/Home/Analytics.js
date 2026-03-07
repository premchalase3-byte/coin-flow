import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Analytics = ({ transactions }) => {

  const TotalTransactions = transactions.length;

  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "income"
  );

  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100 || 0;

  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100 || 0;

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent =
    (totalTurnOverIncome / totalTurnOver) * 100 || 0;

  const TurnOverExpensePercent =
    (totalTurnOverExpense / totalTurnOver) * 100 || 0;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#ff6384",
    Rent: "#36a2eb",
    Salary: "#ffce56",
    Tip: "#4bc0c0",
    Food: "#9966ff",
    Medical: "#ff9f40",
    Utilities: "#8ac926",
    Entertainment: "#6a4c93",
    Transportation: "#1982c4",
    Other: "#f45b69",
  };

  return (
    <Container className="mt-4">
      <Row className="g-4">

        {/* TOTAL TRANSACTIONS */}

        <div className="col-lg-3 col-md-6">
          <div className="card analytics-card h-100">

            <div className="card-header">
              Total Transactions
            </div>

            <div className="card-body text-center">

              <h4 style={{color:"#fff"}}>{TotalTransactions}</h4>

              <p style={{color:"#2ecc71"}}>
                <ArrowDropUpIcon/> Income {totalIncomeTransactions.length}
              </p>

              <p style={{color:"#ff4d4d"}}>
                <ArrowDropDownIcon/> Expense {totalExpenseTransactions.length}
              </p>

              <div className="circle-wrapper">

                <CircularProgressBar
                  percentage={totalIncomePercent.toFixed(0)}
                  color="#2ecc71"
                />

                <CircularProgressBar
                  percentage={totalExpensePercent.toFixed(0)}
                  color="#ff4d4d"
                />

              </div>

            </div>

          </div>
        </div>


        {/* TOTAL TURNOVER */}

        <div className="col-lg-3 col-md-6">
          <div className="card analytics-card h-100">

            <div className="card-header">
              Total Turnover
            </div>

            <div className="card-body text-center">

              <h4 style={{color:"#fff"}}>
                ₹ {totalTurnOver}
              </h4>

              <p style={{color:"#2ecc71"}}>
                <ArrowDropUpIcon/>
                {totalTurnOverIncome}
                <CurrencyRupeeIcon fontSize="small"/>
              </p>

              <p style={{color:"#ff4d4d"}}>
                <ArrowDropDownIcon/>
                {totalTurnOverExpense}
                <CurrencyRupeeIcon fontSize="small"/>
              </p>

              <div className="circle-wrapper">

                <CircularProgressBar
                  percentage={TurnOverIncomePercent.toFixed(0)}
                  color="#2ecc71"
                />

                <CircularProgressBar
                  percentage={TurnOverExpensePercent.toFixed(0)}
                  color="#ff4d4d"
                />

              </div>

            </div>

          </div>
        </div>


        {/* CATEGORYWISE INCOME */}

        <div className="col-lg-3 col-md-6">

          <div className="card analytics-card h-100">

            <div className="card-header">
              Categorywise Income
            </div>

            <div className="card-body">

              {categories.map((category) => {

                const income = transactions
                  .filter(
                    (transaction) =>
                      transaction.transactionType === "income" &&
                      transaction.category === category
                  )
                  .reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  );

                const incomePercent =
                  (income / totalTurnOver) * 100 || 0;

                return (
                  <>
                    {income > 0 && (

                      <LineProgressBar
                        label={category}
                        percentage={incomePercent.toFixed(0)}
                        lineColor={colors[category]}
                      />

                    )}
                  </>
                );

              })}

            </div>

          </div>

        </div>


        {/* CATEGORYWISE EXPENSE */}

        <div className="col-lg-3 col-md-6">

          <div className="card analytics-card h-100">

            <div className="card-header">
              Categorywise Expense
            </div>

            <div className="card-body">

              {categories.map((category) => {

                const expenses = transactions
                  .filter(
                    (transaction) =>
                      transaction.transactionType === "expense" &&
                      transaction.category === category
                  )
                  .reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  );

                const expensePercent =
                  (expenses / totalTurnOver) * 100 || 0;

                return (
                  <>
                    {expenses > 0 && (

                      <LineProgressBar
                        label={category}
                        percentage={expensePercent.toFixed(0)}
                        lineColor={colors[category]}
                      />

                    )}
                  </>
                );

              })}

            </div>

          </div>

        </div>

      </Row>
    </Container>
  );
};

export default Analytics;