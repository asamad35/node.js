require("dotenv").config();
const User = require("./model/user");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from MyAuth</h1>");
});

app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!(email && firstname && lastname && password)) {
    res.status(400).send("all fields are required");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.send(404).send("user already exists");
    }
  }
});

module.exports = app;
