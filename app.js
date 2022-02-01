const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/api.router");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handle500,
  handleBadPaths,
} = require("./controllers/error.controller");

const app = express();
app.use(
  cors({
    origin: "https://quizzical-bohr-776a6e.netlify.app",
  })
);
app.use(express.json());

app.use("/api", apiRouter);

app.use("/*", handleBadPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500);

module.exports = app;
