import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Line, Bar } from "react-chartjs-2";
import axios from "../src/axios.js";
import GeminiChat from "./GeminiChat.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./dashboard.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend
);

function Dashboard() {
  // State for Excel/PDF data
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [headers1, setHeaders1] = useState([]);
  const [headers2, setHeaders2] = useState([]);

  // State to hold the actual file objects
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  
  // Loading states for file processing
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [welcome, setWelcome] = useState("Loading...");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/dashboard", { withCredentials: true });
        setWelcome(res.data.message || `Welcome to Dashboard ${res.data.username}`);
      } catch (err) {
        console.error("Unauthorized:", err);
        window.location.href = "/login";
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleFileUpload = async (e, setFile, setData, setHeaders, setLoading) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setLoading(true);
    setFile(uploadedFile);
    setData([]);
    setHeaders([]);
    e.target.value = ""; 

    try {
      const isExcel = uploadedFile.name.endsWith(".xlsx") || uploadedFile.name.endsWith(".xls");

      if (isExcel) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workbook = XLSX.read(event.target.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            if (jsonData.length > 0) {
              setHeaders(Object.keys(jsonData[0]));
              setData(jsonData.map((row, idx) => ({ id: idx, ...row })));
            }
          } catch (error) {
             console.error("Error parsing Excel file:", error);
             alert("Could not parse the Excel file.");
             setFile(null);
          } finally {
             setLoading(false);
          }
        };
        reader.readAsBinaryString(uploadedFile);

      } else if (uploadedFile.type === "application/pdf") {
        const formData = new FormData();
        formData.append("pdfFile", uploadedFile);

        const res = await axios.post(
          "http://localhost:8001/api/files/extract-pdf",
          formData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );
        
        const { data: tableData } = res.data;
        if (tableData && tableData.length > 0) {
          setHeaders(Object.keys(tableData[0]));
          setData(tableData.map((row, idx) => ({ id: idx, ...row })));
        } else {
          alert("No chartable table found in the PDF.");
        }
        setLoading(false);

      } else {
        alert("Unsupported file type. Please upload an Excel or PDF file.");
        setFile(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Could not process the file. The server might be down or the file is corrupted.");
      setFile(null);
      setLoading(false);
    }
  };
  
  const ROW_HEIGHT = 52;
  const HEADER_EXTRA = 110;
  const fixedHeight = 5 * ROW_HEIGHT + HEADER_EXTRA;

  const renderDataGrid = (rows, headers) => {
    const columns = headers.map((key) => ({
      field: key,
      headerName: key.toUpperCase(),
      width: 150,
    }));

    return (
      <div style={{ height: fixedHeight, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          pagination={false}
          hideFooter
          disableSelectionOnClick
          sx={{ ".MuiDataGrid-virtualScroller": { overflowY: "auto" } }}
        />
      </div>
    );
  };

  const renderCharts = (rows, headers) => {
    const numericHeaders = headers.filter((h) =>
      rows.some((row) => !isNaN(row[h]))
    );

    if (numericHeaders.length === 0) return <p>No numeric data to chart.</p>;

    const chartData = {
      labels: rows.map((d, idx) => d[headers[0]] || `Row ${idx + 1}`),
      datasets: numericHeaders.map((h, i) => ({
        label: h,
        data: rows.map((d) => Number(d[h]) || 0),
        borderColor: [
          "rgba(54,162,235,1)", "rgba(75,192,192,1)", "rgba(255,99,132,1)",
        ][i % 3],
        backgroundColor: [
          "rgba(54,162,235,0.5)", "rgba(75,192,192,0.5)", "rgba(255,99,132,0.5)",
        ][i % 3],
        borderWidth: 2,
      })),
    };

    return (
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Trends (Line Chart)</h3>
          <Line data={chartData} />
        </div>
        <div className="dashboard-card">
          <h3>Comparison (Bar Chart)</h3>
          <Bar data={chartData} />
        </div>
      </div>
    );
  };
  
  const renderFileInfo = (file, data, headers, statementNum, isLoading) => {
    if (isLoading) {
      return (
        <div className="dashboard-card">
          <h2>Statement {statementNum}</h2>
          <p>⏳ Processing file, please wait...</p>
        </div>
      );
    }
    if (!file) return null;

    if (data.length > 0) {
      return (
        <div>
          <div className="dashboard-card">
            <h2>Statement {statementNum} - Data Table ({file.name})</h2>
            {renderDataGrid(data, headers)}
          </div>
          {renderCharts(data, headers)}
        </div>
      );
    } else {
      return (
        <div className="dashboard-card">
          <h2>Statement {statementNum} - File Uploaded</h2>
          <p><strong>{file.name}</strong> is ready for text analysis by Gemini, but no table was found for charting.</p>
        </div>
      );
    }
  };

 return (
  <div className="dashboard-container">
    
    <div className="dashboard-top-bar">
      <div> {/* This div groups the title and welcome message together */}
        <h1 className="dashboard-header">📊 FinDash | Data Analysis Dashboard</h1>
        <p>{welcome}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>

    {/* The rest of your dashboard content remains the same */}
    <div className="file-upload">
      <label>Upload Statement 1 (Excel or PDF):</label>
      <input
        type="file" accept=".xlsx, .xls, .pdf"
        onChange={(e) => handleFileUpload(e, setFile1, setData1, setHeaders1, setLoading1)}
      />
    </div>

    {file1 && (
      <div className="file-upload-secondary">
        <label>Upload Statement 2 to Compare:</label>
        <input
          type="file" accept=".xlsx, .xls, .pdf"
          onChange={(e) => handleFileUpload(e, setFile2, setData2, setHeaders2, setLoading2)}
        />
      </div>
    )}
    
    <div className={file1 && file2 ? "comparison-grid" : ""}>
      {file1 && renderFileInfo(file1, data1, headers1, 1, loading1)}
      {file2 && renderFileInfo(file2, data2, headers2, 2, loading2)}
    </div>

    <div style={{ marginTop: "2rem" }}>
      <GeminiChat data1={data1} data2={data2} file1={file1} file2={file2} />
    </div>
  </div>
);
}

export default Dashboard;