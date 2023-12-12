const dbConfig = require("../configs/db.configs");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.loans = require("./loans.model.js")(sequelize, Sequelize);

db.users.hasMany(db.loans, { as: "loans" });
db.loans.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
})

module.exports = db;