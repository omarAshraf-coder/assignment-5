const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('assignment5', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;