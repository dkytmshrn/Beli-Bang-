if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = require("./routes");
const cors = require("cors");
const errorHandling = require("./middlewares/errorHandling");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test Server BeliBang");
});

app.use(router);
app.use(errorHandling);

module.exports = app;
