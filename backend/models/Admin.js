const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  permissions: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User', // Utilise une chaîne de caractères pour référencer le modèle User
      key: 'id',
    },
  },
}, {
  tableName: 'admin',
});

module.exports = Admin;