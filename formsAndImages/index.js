const express = require("express");

const app = express();
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dhfc9g4l0",
  api_key: "634685325184552",
  api_secret: "4BJNKpMabM6dWxwMQiPtaLeABtI",
});

app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/myget", (req, res) => {
  console.log(req.query);

  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  const file = req.files.samplefile;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
  });

  console.log(req.body);

  const details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
  };

  res.send(details);
});

app.get("/mygetform", (req, res) => {
  res.render("getForm");
});
app.get("/mypostform", (req, res) => {
  res.render("postForm");
});

app.listen(4001, () => console.log("Listening on port 4001..."));
