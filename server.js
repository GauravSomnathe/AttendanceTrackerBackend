require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS setup for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // http://localhost:5173 or your deployed frontend
    credentials: true, // allow cookies/tokens if needed
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/leave", require("./routes/leave"));
app.use("/api/employees", require("./routes/employee"));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Attendance Management API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
