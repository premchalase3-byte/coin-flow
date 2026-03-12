import Groq from "groq-sdk";

export const financeChatbot = async (req, res) => {

  try {

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor helping users manage their expenses and savings."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama3-8b-8192"
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI failed"
    });

  }

};