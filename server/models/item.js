const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
  "item",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
    email: {
      type: Sequelize.STRING,
    },
    height: {
      type: Sequelize.INTEGER,
    },
    width: {
      type: Sequelize.INTEGER,
    },
    length: {
      type: Sequelize.INTEGER,
    },
    weight: {
      type: Sequelize.INTEGER,
    },
    fragility: {
      type: Sequelize.INTEGER,
    },
    freightCost: {
      type: Sequelize.DECIMAL,
    },
    estimatedValue: {
      type: Sequelize.DECIMAL,
    },
  },
  {
    timestamps: false,
  }
);
