const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

//debug
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

//template engine(pug) for generating html in the server
app.set("view engine", "pug");
app.set("views", "./views");

//configuration
console.log(`name:${config.get("name")}`);
console.log(`password:${config.get("mail.password")}`);

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("hello morgan"); //DEBUG=app:startup
}
//custom middleware
app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, console.log("Listening port " + port));
