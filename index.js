const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routesHandler/todoHandler");
const userHandler = require("./routesHandler/userHandler");
require('dotenv').config(); // Load environment variables from .env

//express app initialization
const app = express();
dotenv.config();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => console.log("connection successfull"))
  .catch(() => console.log("err"));

//application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

//default error handler
const errorhandler = (err, req, res, next)=> {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500), json({ error: err.message });
}

app.use(errorhandler);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
