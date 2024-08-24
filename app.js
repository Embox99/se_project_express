const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { getItems } = require("./controllers/clothingItems");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Conected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use("/", mainRouter);
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
