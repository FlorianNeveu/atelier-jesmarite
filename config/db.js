const { Sequelize } = require('sequelize');
require('dotenv').config(); // import environment variables

// create a new instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging : false
})

const testDbConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log('Db connected with success');
    } catch (error) {
        console.error('Impossible to connect to the Db because of:', error)
    }
};

testDbConnection();

module.exports = sequelize;