require("dotenv").config();
const app = require("./app");
const connectWithDb = require("./config/db");

const port = process.env.port;

// connect with database
connectWithDb();
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
