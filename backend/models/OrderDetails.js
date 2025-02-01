const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderDetails = sequelize.define('OrderDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User', // Utilise une chaîne de caractères pour référencer le modèle User
      key: 'id',
    },
  },
}, {
  tableName: 'order_details',
});

module.exports = OrderDetails;