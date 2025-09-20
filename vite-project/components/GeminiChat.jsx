

import React, { useState } from "react";
import axios from "../src/axios.js"; 


function GeminiChat({ data1, data2, file1, file2 }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    // Check if there are any files to analyze
    if (!file1 && !file2) {
      setResponse("Please upload a file in the dashboard to begin.");
      return;
    }
    if (!prompt.trim()) {
      setResponse("Please type a question.");
      return;
    }
    
    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      
      const formData = new FormData();
      formData.append("prompt", prompt);

      // 1. Package Excel data into a single JSON string if it exists
      const excelData = {};
      if (data1 && data1.length > 0) excelData.statement1 = data1;
      if (data2 && data2.length > 0) excelData.statement2 = data2;
      
      if (Object.keys(excelData).length > 0) {
        formData.append("excelDataJSON", JSON.stringify(excelData));
      }

      // 2. Append any PDF files
      if (file1 && file1.type === "application/pdf") {
        formData.append("files", file1);
      }
      if (file2 && file2.type === "application/pdf") {
        formData.append("files", file2);
      }

      
      const res = await axios.post(
        "http://localhost:8001/api/gemini", // backend route
        formData, // send formData object
        { 
          headers: {
            // Browser sets the correct boundary with multipart/form-data
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true 
        }
      );
      setResponse(res.data.result || "No response");
    } catch (err) {
      console.error("Gemini API Error:", err);
      const errorMsg = err.response?.data?.error || "Error fetching response";
      setResponse(`⚠️ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-chat">
      <h2>Ask Gemini About Your Data</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask a question about the uploaded file(s)... e.g., 'Summarize the PDF' or 'What are the key trends in the Excel data?'"
        rows="4"
        cols="50"
      />
      <br />
      {/* Disable button if loading or if no files are uploaded */}
      <button onClick={handleSend} disabled={loading || (!file1 && !file2)}>
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>

      {response && (
        <div className="gemini-response">
          <h3>Response:</h3>
          {/* Use a pre-wrap to preserve formatting like line breaks */}
          <p style={{ whiteSpace: "pre-wrap" }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default GeminiChat;