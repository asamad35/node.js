const express = require("express");
const app = require("../app");
const router = express.Router();

const { home } = require("../controllers/homeController");
router.route("/").get(home);

module.exports = router;
