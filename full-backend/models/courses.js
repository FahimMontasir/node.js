const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    category: {
      type: categorySchema,
      required: true,
    },
    numberInStock: Number,
  })
);

exports = Course;
