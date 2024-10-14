const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routesHandler/todoHandler");

//express app initialization
const app = express();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => console.log("connection successfull"))
  .catch(() => console.log("err"));

//application routes
app.use("/todo", todoHandler);

//default error handler
function errorhandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500), json({ error: err.message });
}

app.listen(3000, () => {
  console.log("listening on port 3000");
});
