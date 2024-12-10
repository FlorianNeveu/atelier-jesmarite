const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const OrderDetails = require('./OrderDetails');

const OrderItems = sequelize.define('OrderItems', {
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
  tableName: 'order_items',
});

OrderItems.belongsTo(Product, { foreignKey: 'product_id' });
OrderItems.belongsTo(OrderDetails, { foreignKey: 'order_id' });

module.exports = OrderItems;
