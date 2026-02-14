const express = require("express");
const path = require("path");
const cors = require("cors");
const config = require("./config");
const productRoutes = require("./routes/products-routes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Allow frontend to call this API
app.use(
  cors({
    origin: config.clientUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Product API routes
app.use("/api/products", productRoutes);

// In production, serve the frontend build
if (config.nodeEnv === "production") {
  const clientDist = process.env.CLIENT_DIST_PATH
    ? path.resolve(process.env.CLIENT_DIST_PATH)
    : path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// If no route matched, return 404
app.use(notFound);
// Send errors back as JSON
app.use(errorHandler);

module.exports = app;
