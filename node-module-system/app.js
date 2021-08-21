//path module
const path = require("path");
const obJPath = path.parse(__filename);

const Logger = require("./logger");
const logger = new Logger();

//register a listener
logger.on("messageLogged", (arg) => {
  console.log("listener called", arg);
});

logger.log("message");
