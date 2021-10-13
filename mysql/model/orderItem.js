const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = OrderItem;
