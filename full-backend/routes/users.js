const express = require("express");

const { validateUser } = require("../helper/validate");
const User = require("../models/users");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const user = new User({
    name: req.body.name,
    isGold: req.body.isGold,
  });
  await user.save();

  res.send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold },
    { new: true }
  );

  if (!user) return res.status(404).send("the user was not found");

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send("the user was not found");

  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send("the user was not found");

  res.status(200).send(user);
});

module.exports = router;
