const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const OrderDetails = sequelize.define('OrderDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'order_details',
});

OrderDetails.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(OrderDetails, { foreignKey: 'user_id' });

module.exports = OrderDetails;
