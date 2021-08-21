const express = require("express");

const { validateCourse } = require("../helper/validate");
const { Category } = require("../models/category");
const Course = require("../models/courses");

const router = express.Router();

router.get("/", async (req, res) => {
  const courses = await Course.find().sort("name");
  res.send(courses);
});

router.post("/", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("invalid category");

  const course = new Course({
    name: req.body.name,
    numberInStock: 5,
    category: {
      _id: category._id,
      name: category.name,
    },
  });
  await course.save();

  res.send(course);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!course) return res.status(404).send("the course was not found");

  res.send(course);
});

router.delete("/:id", async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);

  if (!course) return res.status(404).send("the course was not found");

  res.send(course);
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return res.status(404).send("the course was not found");

  res.status(200).send(course);
});

module.exports = router;
