const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node_db", "root", "fahim67802", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

//--------------------manually connecting mysql2---------------------
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node_db",
//   password: "fahim67802",
// });

// module.exports = pool.promise();
