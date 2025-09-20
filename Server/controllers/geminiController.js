import fs from "fs";
import axios from "axios";
import pdfParse from "pdf-parse";

export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;
    let fileContent = "";

    // Parse uploaded file
    if (req.file) {
      const filePath = req.file.path;

      if (req.file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        fileContent = pdfData.text; // pdf-parse automatically extracts text
      } else if (req.file.mimetype === "text/plain") {
        fileContent = fs.readFileSync(filePath, "utf-8");
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Unsupported file type" });
      }

      fs.unlinkSync(filePath); // cleanup
    }

    const combinedPrompt = prompt
      ? `${prompt}\n\nFile content:\n${fileContent}`
      : fileContent || "Please provide a prompt or file.";

    // Gemini API call
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        contents: [
          { role: "user", parts: [{ text: combinedPrompt }] },
        ],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({ result: reply });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Gemini API error" });
  }
};
