const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product.');
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

CartItem.belongsTo(Product, { foreignKey: 'product_id' });
CartItem.belongsTo(ShoppingSession, { foreignKey: 'session_id' });

module.exports = CartItem;
