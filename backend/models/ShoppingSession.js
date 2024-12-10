const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const ShoppingSession = sequelize.define('ShoppingSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  tableName: 'shopping_session',
});

ShoppingSession.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(ShoppingSession, { foreignKey: 'user_id' });

module.exports = ShoppingSession;
