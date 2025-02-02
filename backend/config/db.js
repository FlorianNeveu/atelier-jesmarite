const { Sequelize } = require('sequelize');
require('dotenv').config(); // Import environment variables

// Utiliser l'URL complète de la base de données dans Sequelize
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'mysql',
    logging: false, // Désactive les logs SQL si besoin
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false // Si nécessaire pour une connexion sécurisée
        }
    }
});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Db connected with success');
    } catch (error) {
        console.error('Impossible to connect to the Db because of:', error);
    }
};

testDbConnection();

module.exports = sequelize;
