const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");

const { Purchase } = require("../models/purchase");
const User = require("../models/users");
const Course = require("../models/courses");
const { validatePurchase } = require("../helper/validate");

const router = express.Router();
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const purchase = await Purchase.find();

  res.send(purchase);
});

router.post("/", async (req, res) => {
  const { error } = validatePurchase(req.body);
  if (error) return res.status(400).send("invalid input");

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("invalid user");

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("invalid course");

  let purchase = new Purchase({
    user: {
      _id: user._id,
      name: user.name,
    },
    course: {
      _id: course._id,
      name: course.name,
    },
  });

  try {
    new Fawn.Task()
      .save("purchases", purchase)
      .update("courses", { _id: course._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(purchase);
  } catch (error) {
    res.status(500).send("something failed");
  }

  // purchase = await purchase.save();

  // course.numberInStock--;
  // course.save();
});

exports = router;
