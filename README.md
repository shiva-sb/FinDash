# 📊 FinDash | Financial Data Analysis Dashboard

FinDash is a dynamic web application designed to help users upload, visualize, and analyze their financial data from various sources like Excel spreadsheets and PDF documents. By leveraging interactive charts and an integrated AI chat powered by the Google Gemini API, FinDash turns raw data into actionable insights.

### 📸 Application Screenshots

| Register Page | Login Page |
| :---: | :---: |
| ![Register Page](https://github.com/user-attachments/assets/fef7df89-5280-4371-9605-97f559f34e65) | ![Login Page](https://github.com/user-attachments/assets/bcbcfa9e-9f17-40ac-81ca-a4f11e42cec5) |

| Dashboard | Charts View |
| :---: | :---: |
| ![Dashboard](https://github.com/user-attachments/assets/7dc207dd-3783-44ed-81b9-c5aa048825e3) | ![Charts](https://github.com/user-attachments/assets/94dcbe4a-c293-4e1e-a09d-9c8dabc5fcea) |
## ✨ Key Features

* **Multi-Format File Upload**: Seamlessly upload financial statements in both `.xlsx` and `.pdf` formats.
* **Dynamic Data Visualization**: Automatically generate interactive line and bar charts from tabular data found in your files.
* **Side-by-Side Comparison**: Upload two separate statements to compare data, tables, and charts in a clear, side-by-side view.
* **AI-Powered Insights**: An integrated Gemini chat allows you to ask complex questions about your uploaded data in natural language. Get summaries, identify trends, and query specific information without manual digging.
* **Secure User Authentication**: Full user registration and login system using JWT (JSON Web Tokens) to ensure user data is private and secure.
* **Responsive Design**: A clean, modern, and responsive user interface that works across various devices.

---

## 🚀 Tech Stack

### Frontend
* **React**: A JavaScript library for building user interfaces.
* **React Router**: For client-side routing.
* **Chart.js**: For creating responsive and interactive charts.
* **Axios**: For making HTTP requests to the backend API.
* **Material-UI DataGrid**: For displaying tabular data in a clean, sortable grid.
* **XLSX (SheetJS)**: For parsing and reading Excel files directly in the browser.

### Backend
* **Node.js**: A JavaScript runtime environment.
* **Express**: A minimal and flexible Node.js web application framework.
* **MongoDB**: A NoSQL database to store user information.
* **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JSON Web Token (JWT)**: For implementing secure user authentication.
* **Multer**: A middleware for handling `multipart/form-data`, used for file uploads.
* **pdf-parse**: To extract text content from PDF files for AI analysis.
* **pdf-table-extractor**: To parse and extract tabular data from PDFs for charting.

### AI Integration
* **Google Gemini API**: Used for the intelligent chat functionality to analyze file content.

---

## 🏁 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

* Node.js (v18 or later recommended)
* npm (or yarn)
* MongoDB (You can use a local instance or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/findash.git](https://github.com/your-username/findash.git)
    cd findash
    ```

2.  **Install Backend Dependencies:**
    Navigate to the server directory and install the required npm packages.
    ```bash
    cd Server
    npm install
    ```

3.  **Set Up Environment Variables:**
    In the `Server` directory, create a file named `.env` and add the following configuration. **Do not share this file publicly.**
    ```env
    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret for signing tokens
    JWT_SECRET=your_super_secret_key_for_jwt

    # Google Gemini API Key
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Install Frontend Dependencies:**
    Navigate to the client/frontend directory and install its packages.
    ```bash
    cd ../client  # or your frontend folder name
    npm install
    ```

5.  **Run the Application:**
    You will need two separate terminal windows to run both the backend and frontend servers concurrently.

    * **In the first terminal (from the `Server` directory):**
        ```bash
        npm start # or 'nodemon index.js' if you have nodemon installed
        ```
        The backend server should now be running, typically on `http://localhost:8001`.

    * **In the second terminal (from the `client` directory):**
        ```bash
        npm run dev
        ```
        The React development server will start, and you can view the application in your browser, usually at `http://localhost:5173`.

---

## 📂 Project Structure
```bash
findash/
├── client/              # React Frontend
│   ├── public/
│   └── src/
│       ├── components/  # Reusable React components (Dashboard, GeminiChat, etc.)
│       ├── pages/       # Page components (Login, Register)
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── Server/              # Node.js & Express Backend
├── controllers/     # Logic for handling requests (auth, files, gemini)
├── middleware/      # Custom middleware (e.g., verifyToken)
├── models/          # Mongoose schemas (e.g., User model)
├── routes/          # API route definitions
├── uploads/         # Temporary storage for uploaded files
├── .env             # Environment variables (GITIGNORED)
└── index.js         # Main server entry point
```
---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
