const express = require("express");
const { validateCategory } = require("../helper/validate");
const { Category } = require("../models/category");

const router = express.Router();

router.get("/", async (req, res) => {
  const category = await Category.find();

  res.send(category);
});

router.post("/", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send("invalid input");

  const category = new Category({
    name: req.body.name,
  });
  await category.save();

  res.send(category);
});

module.exports = router;
