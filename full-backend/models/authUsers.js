const { model, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const authUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
});

authUserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const AuthUser = model("AuthUser", authUserSchema);
module.exports.AuthUser = AuthUser;
