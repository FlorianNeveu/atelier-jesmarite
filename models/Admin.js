const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  permissions: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'admin',
});

Admin.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Admin, { foreignKey: 'user_id' });

module.exports = Admin;
