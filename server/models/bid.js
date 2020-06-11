const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
  "bid",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemID: {
      type: Sequelize.INTEGER,
    },
    userID: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
    },
    bid: {
      type: Sequelize.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);
