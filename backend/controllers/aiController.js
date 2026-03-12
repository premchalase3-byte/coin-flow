import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const financeChatbot = async (req, res) => {

  try {

    const { message, transactions } = req.body;

    let transactionSummary = "No transaction data available.";

    if (transactions && transactions.length > 0) {

      const totalExpense = transactions
        .filter(t => t.transactionType === "expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const totalIncome = transactions
        .filter(t => t.transactionType === "income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const categories = {};

      transactions.forEach(t => {

        if (t.transactionType === "expense") {

          if (!categories[t.category]) {
            categories[t.category] = 0;
          }

          categories[t.category] += Number(t.amount);

        }

      });

      transactionSummary = `
Total Income: ₹${totalIncome}
Total Expense: ₹${totalExpense}

Expenses by category:
${JSON.stringify(categories)}
`;

    }

    const prompt = `
You are a financial advisor AI inside a fintech app called CoinFlow.

User question:
${message}

User financial data:
${transactionSummary}

Give personalized financial advice based on the user's spending.
Keep the response short and helpful.
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      reply: "AI service error. Please try again."
    });

  }

};