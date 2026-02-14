const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config");

// Create Express app
const app = express();
const PORT = config.port || 3000;

// Connect to MongoDB
mongoose
    .connect(config.mongodbUri)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

app.use(express.json());

// API Routes
app.get("/api/message", (req, res) => {
    res.json({
        success: true,
        message: "Hello from the backend API!",
        timestamp: new Date().toISOString(),
    });
});

// Import product routes
const productRoutes = require("./routes/products-routes");

// Use the product routes
app.use("/api/products", productRoutes);


const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));



app.get(/.*/, (req, res) => {
    // If it's an API request that didn't match anything, return 404 JSON
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ success: false, message: "API route not found" });
    }

    // For all other routes (like /products, /about), serve the frontend
    res.sendFile(path.join(publicPath, "index.html"));
});


app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Serving frontend from: ${publicPath}`);
    console.log(` API available at: http://localhost:${PORT}/api`);
});
