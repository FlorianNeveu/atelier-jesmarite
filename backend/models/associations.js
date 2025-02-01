const User = require("./User");
const Admin = require("./Admin");
const OrderDetails = require("./OrderDetails");
const UserAddress = require("./UserAddress");
const UserPayment = require("./UserPayment");
const ShoppingSession = require("./ShoppingSession");
const CartItem = require("./CartItem");
const Product = require("./Product");
const ProductCategory = require("./ProductCategory");
const OrderItems = require("./OrderItems");
const PaymentDetails = require("./PaymentDetails");

// 📌 Relations pour User
User.hasOne(Admin, { foreignKey: "user_id" });
User.hasMany(OrderDetails, { foreignKey: "user_id" });
User.hasMany(UserAddress, { foreignKey: "user_id" });
User.hasMany(UserPayment, { foreignKey: "user_id" });
User.hasOne(ShoppingSession, { foreignKey: "user_id" });

// 📌 Relations pour Admin
Admin.belongsTo(User, { foreignKey: "user_id" });

// 📌 Relations pour les commandes et paiements
OrderDetails.belongsTo(User, { foreignKey: "user_id" });
OrderItems.belongsTo(OrderDetails, { foreignKey: "order_id" });
OrderItems.belongsTo(Product, { foreignKey: "product_id" });
PaymentDetails.belongsTo(OrderDetails, { foreignKey: "order_id" });

// 📌 Relations pour les produits
Product.belongsTo(ProductCategory, { foreignKey: "category_id", as: "category" });
ProductCategory.hasMany(Product, { foreignKey: "category_id" });

// 📌 Relations pour le panier
CartItem.belongsTo(Product, { foreignKey: "product_id" });
CartItem.belongsTo(ShoppingSession, { foreignKey: "session_id" });

module.exports = {
  User,
  Admin,
  OrderDetails,
  UserAddress,
  UserPayment,
  ShoppingSession,
  CartItem,
  Product,
  ProductCategory,
  OrderItems,
  PaymentDetails,
};
