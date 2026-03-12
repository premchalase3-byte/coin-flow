import React, { useEffect, useState } from "react";
import "./AIInsights.css";

const AIInsights = ({ transactions }) => {

  const [insight, setInsight] = useState("");

  useEffect(() => {

    if (!transactions || transactions.length === 0) return;

    generateInsights();

  }, [transactions]);



  const generateInsights = () => {

    const expenses = transactions.filter(
      (t) => t.transactionType === "expense"
    );

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

    const message = `You spent ₹${highestAmount} on ${highestCategory}. 
Try reducing this by 20% to save about ₹${suggestedSaving}.`;

    setInsight(message);

  };


  return (

    <div className="ai-insight-card">

      <h4>🤖 AI Financial Insight</h4>

      <p>{insight}</p>

    </div>

  );

};

export default AIInsights;