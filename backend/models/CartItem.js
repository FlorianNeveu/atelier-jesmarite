const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const ShoppingSession = require('./ShoppingSession');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'cart_item',
});

module.exports = CartItem;
