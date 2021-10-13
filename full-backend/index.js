const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

//---------------debug--------------------------
// const morgan = require("morgan");
// const startupDebugger = require("debug")("app:startup");
// const dbDebugger = require("debug")("app:db");
// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   startupDebugger("hello morgan"); //DEBUG=app:startup
// }

const port = process.env.PORT || 3000;
app.listen(port, winston.info("Listening port " + port));
