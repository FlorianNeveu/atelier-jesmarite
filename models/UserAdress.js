const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const UserAddress = sequelize.define('UserAddress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  address_line1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_line2: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'user_address',
});

UserAddress.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserAddress, { foreignKey: 'user_id' });

module.exports = UserAddress;
