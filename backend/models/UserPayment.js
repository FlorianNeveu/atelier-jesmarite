const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const UserPayment = sequelize.define('UserPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
  },
  account_token: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'user_payment',
});

module.exports = UserPayment;