const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("ngc", "ngc", "P@ssword1", {
  host: "localhost",
  dialect: "mysql",
  operatorAliases: false,

  pool: {
    max: 5,
    min: 0,
    aquire: 30000,
    idle: 1000,
  },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
