const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { AuthUser } = require("../models/authUsers");
const { validateLogin } = require("../helper/validate");
//log out func should not be implemented in the server
//login user
router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await AuthUser.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(404).send("invalid email or password");

  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
