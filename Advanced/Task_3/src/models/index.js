const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Post = require('./Post')(sequelize, Sequelize.DataTypes);
db.Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Tag = require('./Tag')(sequelize, Sequelize.DataTypes);
db.PostTag = require('./PostTag')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
