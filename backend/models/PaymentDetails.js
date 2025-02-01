const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OrderDetails = require('./OrderDetails');

const PaymentDetails = sequelize.define('PaymentDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'payment_details',
});

module.exports = PaymentDetails;
