const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const {createUser, login} = require("./controllers/users");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Conected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "66bca44ede2a2ea8845c4f73",
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
