module.exports = (sequelize, Sequelize) => {
  const WhereSale = sequelize.define('whereSale', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isOnline: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
  return WhereSale;
};
