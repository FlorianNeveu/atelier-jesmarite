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
}, {
  tableName: 'user_payment',
});

UserPayment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserPayment, { foreignKey: 'user_id' });

module.exports = UserPayment;
