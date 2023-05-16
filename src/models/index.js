const Sequelize = require('sequelize');
const reset = require('../setup');

const setupRelationship = require('../setupRelationship');
require('dotenv').config();

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  pass: process.env.MYSQL_PASS,
  dbName: process.env.MYSQL_DB,
};

const sequelize = new Sequelize(config.dbName, config.user, config.pass, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//MODELS
db.user = require('./user.model')(sequelize, Sequelize);
db.result = require('./result.model')(sequelize, Sequelize);
db.image = require('./image.model')(sequelize, Sequelize);
db.nameBusiness = require('./nameBusiness.model')(sequelize, Sequelize);
db.typeOfSale = require('./typeOfSale.model')(sequelize, Sequelize);
db.whereSale = require('./whereSale.model')(sequelize, Sequelize);
db.typeBusiness = require('./typeBusiness.model')(sequelize, Sequelize);

setupRelationship(db);

module.exports = db;
