const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "my express app", message: "yo yo html" });
});

module.exports = router;
