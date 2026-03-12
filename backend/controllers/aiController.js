import OpenAI from "openai";
import Transaction from "../models/TransactionModel.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const financeChatbot = async (req, res) => {
  try {

    const { userId, message } = req.body;

    // Get user transactions
    const transactions = await Transaction.find({ user: userId });

    // Format transactions for AI
    const transactionSummary = transactions.map(t => {
      return `${t.category} - ₹${t.amount} (${t.transactionType})`;
    }).join("\n");

    const prompt = `
You are a financial advisor AI.

User transaction history:
${transactionSummary}

User question:
${message}

Give helpful financial advice based on the user's spending.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful financial advisor." },
        { role: "user", content: prompt }
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "AI service failed"
    });
  }
};