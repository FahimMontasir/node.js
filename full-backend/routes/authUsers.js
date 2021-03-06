const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");

const { AuthUser } = require("../models/authUsers");
const { validateAuthUser } = require("../helper/validate");

//getting user data
router.get("/me", authMiddleware, async (req, res) => {
  const user = await AuthUser.findById(req.user._id).select("-password");
  res.send(user);
});

//register user
router.post("/", async (req, res) => {
  const { error } = validateAuthUser(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await AuthUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already exist");

  user = new AuthUser(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
