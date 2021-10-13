const winston = require("winston");

const error = (err, req, res, next) => {
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("something failed");
};

module.exports = error;
