const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log" })
  );

  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/full_backend",
  //   level: "info",
  // });
};

// throw new Error("something failed during startup");
// const p = Promise.reject(new Error("something failed miserably!"));
// p.then(() => console.log("done"));
