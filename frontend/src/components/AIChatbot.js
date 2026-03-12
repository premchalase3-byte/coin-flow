import React, { useState } from "react";
import "./AIChatbot.css";

const AIChatbot = () => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };

    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setTyping(true);

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

      typeMessage(data.reply);

    } catch (err) {

      typeMessage("AI service unavailable.");

    }

  };


  /* ========================= */
  /* Typing Animation */
  /* ========================= */

  const typeMessage = (text) => {

    let index = 0;
    let typed = "";

    const interval = setInterval(() => {

      typed += text[index];
      index++;

      setChat(prev => {

        const last = prev[prev.length - 1];

        if (last && last.sender === "ai") {

          const updated = [...prev];
          updated[updated.length - 1].text = typed;
          return updated;

        } else {

          return [...prev, { sender: "ai", text: typed }];

        }

      });

      if (index === text.length) {
        clearInterval(interval);
        setTyping(false);
      }

    }, 20); // typing speed

  };


  return (
    <>

      {/* Floating Button */}

      <div
        className="ai-button"
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>

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

            {typing && (
              <div className="ai-msg typing">
                AI is typing...
              </div>
            )}

          </div>

          <div className="ai-input">

            <input
              type="text"
              placeholder="Ask about your finances..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
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