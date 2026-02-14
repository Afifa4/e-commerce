// Load environment variables from .env file
require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config");
const app = require("./app");

const port = config.port;

// Connect to database, then start the server
mongoose
  .connect(config.mongodbUri)
  .then(() => app.listen(port))
  .catch(() => process.exit(1));
