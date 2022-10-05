require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ejs
app.set("view engine", "ejs");

// morgan middleware
app.use(morgan("tiny"));

// import all routes here
const homeRoute = require("./routes/homeRoute");
const signupRoute = require("./routes/signupRoute");

// router middleware
app.use("/api/v1", homeRoute);
app.use("/api/v1", signupRoute);

// ejs render
app.get("/api/v1/signuptest", (req, res) => {
  res.render("postForm");
});

module.exports = app;
