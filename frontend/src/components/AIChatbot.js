import React, { useState } from "react";
import "./AIChatbot.css";

const AIChatbot = () => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat([...chat, userMessage]);

    try {

      const res = await fetch(
        "https://coin-flow-backend.onrender.com/api/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        }
      );

      const data = await res.json();

      const aiMessage = {
        sender: "ai",
        text: data.reply
      };

      setChat(prev => [...prev, aiMessage]);

    } catch (error) {

      setChat(prev => [
        ...prev,
        { sender: "ai", text: "AI service unavailable." }
      ]);

    }

    setMessage("");

  };

  return (
    <>
      {/* Floating Button */}
      <div className="ai-button" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="ai-chat-window glass">

          <div className="ai-header">
            AI Financial Advisor
          </div>

          <div className="ai-messages">

            {chat.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-msg"
                    : "ai-msg"
                }
              >
                {msg.text}
              </div>
            ))}

          </div>

          <div className="ai-input">

            <input
              type="text"
              placeholder="Ask about your finances..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default AIChatbot;
