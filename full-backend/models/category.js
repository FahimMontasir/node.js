const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Category = model("Category", categorySchema);

exports.categorySchema = categorySchema;
exports.Category = Category;
