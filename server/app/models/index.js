const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  // logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usersTable = require("./model.js")(sequelize, Sequelize); // importing 'users' table model from model.js
db.ordersTable = require("./model.js")(sequelize, Sequelize); // importing 'orders' table model from model.js
db.menuItemTable = require("./model.js")(sequelize, Sequelize); // importing 'menu_item' table model from model.js
db.ordersMenuItemTable = require("./model.js")(sequelize, Sequelize); // importing 'orders_menu_item' table model from model.js
db.availabilityTable = require("./model.js")(sequelize, Sequelize); // importing 'availability' table model from model.js
db.menuItemAvailabilityTable = require("./model.js")(sequelize, Sequelize); // importing 'menu_item_availability' table model from model.js

module.exports = db;
