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
// -- necessary when uploading file
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.get("/", (req, res) => {
  res.send("getForm");
});
app.get("/myget", (req, res) => {
  console.log(req.query);

  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  // -- file doesn't comes in req.body , instead it comes in req.files
  // -- if single file is selected it will be object, otherwise it will be array. TO select multiple files use "multiple tag in HTML form"
  const file = req.files.samplefile;
  let result = [];
  if (Array.isArray(file)) {
    for (let i = 0; i < file.length; i++) {
      // --pushing in cloudinary
      const fileObj = await cloudinary.uploader.upload(file[i].tempFilePath, {
        folder: "users",
      });
      result.push(fileObj);
    }
  } else {
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "users",
    });
  }

  const details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
  };
  console.log(details, "details");

  res.send(details);
});

app.get("/mygetform", (req, res) => {
  res.render("getForm");
});
app.get("/mypostform", (req, res) => {
  res.render("postForm");
});

app.listen(4001, () => console.log("Listening on port 4001..."));
// a
