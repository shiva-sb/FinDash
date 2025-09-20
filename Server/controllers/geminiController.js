// geminiController.js

import fs from "fs";
import axios from "axios";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
dotenv.config(); 

export const askGemini = async (req, res) => {
  try {
    const { prompt, excelDataJSON } = req.body;
    let combinedContent = "";

    // Part 1: Process Excel data if it exists
    if (excelDataJSON) {
      // The data is already JSON, just format it for the prompt
      const excelData = JSON.parse(excelDataJSON);
      combinedContent += "Here is the data from the uploaded Excel file(s):\n";
      combinedContent += JSON.stringify(excelData, null, 2);
    }

    // Part 2: Process any uploaded PDF files
    if (req.files && req.files.length > 0) {
      combinedContent += "\n\nHere is the content from the uploaded PDF file(s):\n";
      for (const file of req.files) {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        combinedContent += `\n--- Content from ${file.originalname} ---\n`;
        combinedContent += pdfData.text;
        // Clean up the temporary file
        fs.unlinkSync(file.path);
      }
    }

    if (!prompt && !combinedContent) {
       return res.status(400).json({ error: "No prompt or file content provided." });
    }

    // Combine prompt with all extracted content
    const combinedPrompt = `${prompt}\n\n${combinedContent}`;

    // Gemini API call (remains the same)
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
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