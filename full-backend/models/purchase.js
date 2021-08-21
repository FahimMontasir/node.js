const { Schema, model } = require("mongoose");

const Purchase = model(
  "Purchase",
  new Schema({
    user: {
      type: new Schema({
        name: {
          type: String,
          required: true,
        },
        isGold: Boolean,
      }),
    },
    course: {
      type: new Schema({
        name: {
          type: String,
          required: true,
        },
      }),
    },
    date: Date,
  })
);

exports.Purchase = Purchase;
