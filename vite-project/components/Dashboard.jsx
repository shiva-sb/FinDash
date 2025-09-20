// Dashboard.jsx
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
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [headers1, setHeaders1] = useState([]);
  const [headers2, setHeaders2] = useState([]);
  const [welcome, setWelcome] = useState("Loading...");

  // 🔒 Check auth and fetch welcome message
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/dashboard", { withCredentials: true });
        setWelcome(res.data.message || `Welcome to Dashboard ${res.data.username}` );
      } catch (err) {
        console.error("Unauthorized:", err);
        window.location.href = "/login"; // redirect if not authenticated
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

  const handleFileUpload = (e, setData, setHeaders) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (jsonData.length === 0) return;

      const dynamicHeaders = Object.keys(jsonData[0]);
      setHeaders(dynamicHeaders);

      const formattedData = jsonData.map((row, idx) => ({
        id: idx,
        ...row,
      }));

      setData(formattedData);
    };
    reader.readAsBinaryString(file);

    e.target.value = "";
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
          sx={{
            ".MuiDataGrid-virtualScroller": { overflowY: "auto" },
          }}
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
          "rgba(54,162,235,1)",
          "rgba(75,192,192,1)",
          "rgba(255,99,132,1)",
        ][i % 3],
        backgroundColor: [
          "rgba(54,162,235,0.5)",
          "rgba(75,192,192,0.5)",
          "rgba(255,99,132,0.5)",
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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">📊 Excel Comparison Dashboard</h1>
      <p>{welcome}</p>
      <button onClick={handleLogout}>Logout</button>

      {/* Upload Statement 1 */}
      <div className="file-upload">
        <label>Upload Statement 1:</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFileUpload(e, setData1, setHeaders1)}
        />
      </div>

      {/* Upload or Change Statement 2 */}
      {data1.length > 0 && (
        <div className="file-upload-secondary">
          {data2.length === 0 ? (
            <>
              <label>Want to compare? Upload Statement 2:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, setData2, setHeaders2)}
              />
            </>
          ) : (
            <>
              <p><strong>Statement 2:</strong> File uploaded ✅</p>
              <label>Change Statement 2:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, setData2, setHeaders2)}
              />
              <button
                onClick={() => {
                  setData2([]);
                  setHeaders2([]);
                }}
              >
                Remove Statement 2
              </button>
            </>
          )}
        </div>
      )}

      {/* Statement 1 only */}
      {data1.length > 0 && data2.length === 0 && (
        <div>
          <div className="dashboard-card">
            <h2>Statement 1 - Data Table</h2>
            {renderDataGrid(data1, headers1)}
          </div>
          {renderCharts(data1, headers1)}
        </div>
      )}

      {/* Comparison view */}
      {data1.length > 0 && data2.length > 0 && (
        <div className="comparison-grid">
          <div>
            <div className="dashboard-card">
              <h2>Statement 1 - Data Table</h2>
              {renderDataGrid(data1, headers1)}
            </div>
            {renderCharts(data1, headers1)}
          </div>
          <div>
            <div className="dashboard-card">
              <h2>Statement 2 - Data Table</h2>
              {renderDataGrid(data2, headers2)}
            </div>
            {renderCharts(data2, headers2)}
          </div>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <GeminiChat />
      </div>
    </div>
  );
}

export default Dashboard;
