import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const financeChatbot = async (req, res) => {
  try {

    const { message, transactions } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Please ask a question."
      });
    }

    /* ========================= */
    /* Prepare Transaction Data */
    /* ========================= */

    let transactionSummary = "No transaction data available.";

    if (Array.isArray(transactions) && transactions.length > 0) {

      const totalExpense = transactions
        .filter(t => t.transactionType === "expense")
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

      const totalIncome = transactions
        .filter(t => t.transactionType === "income")
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

      const categories = {};

      transactions.forEach(t => {

        if (t.transactionType === "expense") {

          const cat = t.category || "Other";

          if (!categories[cat]) {
            categories[cat] = 0;
          }

          categories[cat] += Number(t.amount || 0);

        }

      });

      transactionSummary = `
Total Income: ₹${totalIncome}
Total Expense: ₹${totalExpense}

Expense by category:
${JSON.stringify(categories, null, 2)}
`;

    }

    /* ========================= */
    /* AI Prompt */
    /* ========================= */

    const prompt = `
You are a financial advisor AI inside a fintech app called CoinFlow.

User question:
${message}

User financial data:
${transactionSummary}

Analyze the user's spending and provide short helpful financial advice.
If spending looks balanced, say so.
If overspending exists, suggest improvement tips.
`;

    /* ========================= */
    /* Call GROQ AI */
    /* ========================= */

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "I couldn't analyze the finances right now.";

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("AI ERROR:", error);

    return res.status(500).json({
      reply: "AI service error. Please try again."
    });

  }
};