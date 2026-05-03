const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

const path = require("path");

const PORT = process.env.PORT || 5000;

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

const fs = require("fs");
const distPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.resolve(distPath, "index.html"));
    } else {
      res.status(404).json({ msg: "API endpoint not found" });
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running (Frontend not built yet)...");
  });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
