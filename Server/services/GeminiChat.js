// GeminiChat.jsx

import { useState } from "react";
import axios from "axios";


function GeminiChat({ data1, data2 }) {
  const [userInput, setUserInput] = useState("");
  const [botReply, setBotReply] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Optional: for loading state

  const handleSend = async () => {
    // Check if there is data to analyze
    if (data1.length === 0 && data2.length === 0) {
      setBotReply("Please upload at least one Excel file in the dashboard to chat about it.");
      return;
    }

    setIsLoading(true);
    setBotReply("");

    try {
      const token = localStorage.getItem("token");

      
      let excelDataString = "";
      if (data1.length > 0) {
        excelDataString += "Statement 1 Data:\n" + JSON.stringify(data1, null, 2);
      }
      if (data2.length > 0) {
        excelDataString += "\n\nStatement 2 Data:\n" + JSON.stringify(data2, null, 2);
      }

      
      const res = await axios.post(
        "http://localhost:8001/api/gemini",
        {
          prompt: userInput,
          excelData: excelDataString, // Send the stringified data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      setBotReply(res.data.result);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setBotReply(err.response?.data?.error || "Error contacting server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask Gemini About Your Data</h2>
      <p>Ask a question about the uploaded Excel statement(s).</p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., 'What is the total revenue from statement 1?'"
          style={{ flexGrow: 1, padding: "8px" }}
          disabled={isLoading}
        />
        
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
      {botReply && (
         <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0", border: "1px solid #ccc", borderRadius: "5px" }}>
            <p><strong>Gemini:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{botReply}</p>
         </div>
      )}
    </div>
  );
}

export default GeminiChat;