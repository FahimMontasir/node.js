const { Schema, model } = require("mongoose");

const User = model(
  "user",
  new Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    isGold: Boolean,
  })
);

exports = User;
