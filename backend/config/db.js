const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
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
