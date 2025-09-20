import fs from "fs";
import { exec } from "child_process";


export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  
  res.json({
    message: "File uploaded successfully",
    fileName: req.file.filename,
  });
};



export const extractTableFromPdf = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded." });
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}.json`;

  
  const pythonCommand = `python ./scripts/parser.py ${inputPath} ${outputPath}`;

  exec(pythonCommand, (error, stdout, stderr) => {
    // Always clean up the uploaded PDF file
    fs.unlinkSync(inputPath);

    if (error) {
      console.error(`Exec error: ${error}`);
      return res.status(500).json({ error: "Failed to parse PDF table." });
    }

    // Try to read the JSON file created by the Python script
    fs.readFile(outputPath, "utf8", (err, data) => {
      // Clean up the created JSON file
      if (!err) fs.unlinkSync(outputPath);
      
      if (err) {
        return res.status(500).json({ error: "Failed to read parsed data." });
      }
      
      // Send the parsed JSON data back to the frontend
      res.json({ data: JSON.parse(data) });
    });
  });
};