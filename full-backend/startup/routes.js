const express = require("express");
const helmet = require("helmet");

const courses = require("../routes/courses");
const home = require("../routes/home");
const users = require("../routes/users");
const category = require("../routes/category");
const authUsers = require("../routes/authUsers");
const auth = require("../routes/auth");

const logger = require("../middleware/logger");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(helmet());
  app.use("/api/courses", courses);
  app.use("/", home);
  app.use("/api/users", users);
  app.use("/api/category", category);
  app.use("/api/authUsers", authUsers);
  app.use("/api/auth", auth);
  //custom middleware
  app.use(logger);
  app.use(error);

  //template engine(pug) for generating html in the server
  app.set("view engine", "pug");
  app.set("views", "./views");
};
