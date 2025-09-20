import { useState } from "react";
import axios from "axios";

function GeminiChat() {
  const [userInput, setUserInput] = useState("");
  const [file, setFile] = useState(null);
  const [botReply, setBotReply] = useState("");

  const handleSend = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("prompt", userInput);
      if (file) formData.append("file", file);

      const res = await axios.post("http://localhost:8001/api/gemini", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setBotReply(res.data.result);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setBotReply("Error contacting server.");
    }
  };

  return (
    <div>
      <h2>Gemini Chat</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask Gemini..."
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSend}>Send</button>
      <p><strong>Gemini:</strong> {botReply}</p>
    </div>
  );
}

export default GeminiChat;
