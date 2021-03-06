const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = CartItem;
