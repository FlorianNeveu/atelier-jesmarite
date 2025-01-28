const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProductCategory = require('./ProductCategory');  // Pour la relation avec product_category

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  SKU: {
    type: DataTypes.STRING(255),
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  barcode: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ProductCategory,
      key: 'id',
    },
  },
  inventory_id: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'product',
  timestamps: true, 
});

Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });


module.exports = Product;
