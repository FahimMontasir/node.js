const config = require("config");

module.exports = function () {
  // use this command to set env => export full_jwtPrivateKey=something
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivatekey is missing");
  }
  //configuration
  console.log(`name:${config.get("name")}`);
  // console.log(`password:${config.get("mail.password")}`);
};
