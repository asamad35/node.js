require("dotenv").config();
require("./config/database").connect();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from MyAuth</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && firstname && lastname && password)) {
      res.status(400).send("all fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(404).send("user already exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    //  token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log(error, "error in try and catch block");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;

      res.status(201).json(user);
    }
    res.status(400).send("Password or Email is incorrect");
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
