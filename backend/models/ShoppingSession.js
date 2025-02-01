const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const ShoppingSession = sequelize.define('ShoppingSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  }
}, {
  tableName: 'shopping_session',
});

module.exports = ShoppingSession;
