// components/GeminiChat.jsx
import React, { useState } from "react";
import axios from "../src/axios.js"; // ✅ your axios instance (with baseURL and withCredentials)

function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/gemini",   // ✅ backend route
        { prompt },
        { withCredentials: true }
      );
      setResponse(res.data.result || "No response");
    } catch (err) {
      console.error("Gemini API Error:", err);
      setResponse("⚠️ Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-chat">
      <h2>🤖 Gemini Chat</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your question here..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>

      {response && (
        <div className="gemini-response">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default GeminiChat;
