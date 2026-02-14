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

// Serve uploaded images
const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

// Product API routes
app.use("/api/products", productRoutes);

// In production, serve the frontend build (must have client/dist with index.html and /assets/*)
if (config.nodeEnv === "production") {
  const clientDist = process.env.CLIENT_DIST_PATH
    ? path.resolve(process.env.CLIENT_DIST_PATH)
    : path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  // Only send index.html for non-API, non-asset routes (so /assets/* 404s instead of returning HTML)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/assets") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// If no route matched, return 404
app.use(notFound);
// Send errors back as JSON
app.use(errorHandler);

module.exports = app;
