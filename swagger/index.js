const express = require("express");
const app = express();

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const fileUpload = require("express-fileupload");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(fileUpload());

const courses = [
  {
    id: "1",
    name: "React.js",
    price: 299,
    validity: "3 years",
  },
  {
    id: "2",
    name: "Node.js",
    price: 399,
    validity: "3 years",
  },
  {
    id: "3",
    name: "AWS",
    price: 499,
    validity: "3 years",
  },
];

app.get("/", (req, res) => {
  res.send("hello from Abdus");
});

app.get("/api/v1/lco", (req, res) => {
  res.send("hello form swagger docs");
});

app.get("/api/v1/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/v1/mycourse/:courseId", (req, res) => {
  const course = courses.find((el) => el?.id === req.params.courseId);
  res.send(course);
});

app.post("/api/v1/addCourse", (req, res) => {
  console.log(req.body);
  courses.push(req.body);
  res.send(true);
});

app.get("/api/v1/courseQuery", (req, res) => {
  const location = req.query.location;
  const device = req.query.device;

  res.send({ location, device });
});

app.post("/api/v1/courseUpload", (req, res) => {
  const file = req.files.sampleFile;
  let path = __dirname + "/images/" + Date.now() + ".jpeg";

  file.mv(path, (err) => {
    res.send(true);
  });
});

app.listen(4000, () => {
  console.log("server is running at port 4000...");
});
