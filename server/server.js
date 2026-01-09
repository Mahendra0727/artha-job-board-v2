require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const importRoutes = require("./src/routes/importRoutes");

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes - Yeh line zaroori hai
app.use("/api/import", importRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
