# 🩺 Smart Health AI Prediction & Recommendation System

A modern, full-stack **MERN (MongoDB, Express, React, Node)** application migrated from a legacy Java Console Application. It features secure JWT authentication and a custom glassmorphic dashboard configuration for symptom analytics and doctor recommendations.

---

## 📁 Project Structure

- **`backend/`**: Node.js & Express server housing authorization routes (`signup`, `login`), CRUD database hooks, JWT token filters, and health risk matcher logic.
- **`frontend/`**: Vite React.js application offering a responsive dashboard, login pages, and dynamic health alerts.
- **`Health_Prediction_Management_Sysytem_Java-main/`**: Legacy Java Console codebase.

---

## 🛠️ Getting Started

Follow these steps to launch the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017/` (or configure via the `.env` settings).

---

### Step 1: Start the Backend Server

1. Open a terminal and move to the backend folder:
   ```bash
   cd backend
   ```
2. Start the Express server:
   ```bash
   npm run dev
   ```
   *The server will start on port `5000` (e.g. `http://localhost:5000`). Connected database logs will print in the shell.*

---

### Step 2: Start the Frontend Application

1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the React development environment:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the printed local port (usually `http://localhost:5173`).

---

## 🧪 Running Verification Tests
A self-contained testing suite is included in the backend folder to assert that all converted Java rule models match accurately.

Run:
```bash
cd backend
node verify-tests.js
```
