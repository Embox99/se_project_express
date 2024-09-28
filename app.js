const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./utils/rateLimitConfig");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Conected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use("/", mainRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
