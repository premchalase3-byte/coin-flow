import React, { useEffect, useState, useCallback } from "react";
import "./AIInsights.css";

const AIInsights = ({ transactions }) => {

  const [insight, setInsight] = useState("");

  /* ========================= */
  /* Generate Insight */
  /* ========================= */

  const generateInsights = useCallback(() => {

    if (!transactions || transactions.length === 0) {
      setInsight("Add some transactions to receive AI financial insights.");
      return;
    }

    const expenses = transactions.filter(
      (t) => t.transactionType === "expense"
    );

    if (expenses.length === 0) {
      setInsight("No expenses yet. You're doing great!");
      return;
    }

    const categoryTotals = {};

    expenses.forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += Number(t.amount);
    });

    let highestCategory = "";
    let highestAmount = 0;

    for (let category in categoryTotals) {
      if (categoryTotals[category] > highestAmount) {
        highestAmount = categoryTotals[category];
        highestCategory = category;
      }
    }

    const suggestedSaving = Math.round(highestAmount * 0.2);

    const message =
      `You spent ₹${highestAmount} on ${highestCategory}. ` +
      `Try reducing this by 20% to save about ₹${suggestedSaving}.`;

    setInsight(message);

  }, [transactions]);

  /* ========================= */
  /* Run Insight when data changes */
  /* ========================= */

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  return (

    <div className="ai-insight-card">

      <h4>🤖 AI Financial Insight</h4>

      <p>{insight}</p>

    </div>

  );

};

export default AIInsights;