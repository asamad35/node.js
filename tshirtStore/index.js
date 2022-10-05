require("dotenv").config();
const app = require("./app");
const connectWithDb = require("./config/db");
const cloudinary = require("cloudinary");

const port = process.env.port;

// connect with database
connectWithDb();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
