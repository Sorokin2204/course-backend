module.exports = (sequelize, Sequelize) => {
  const TypeOfSale = sequelize.define('typeOfSale', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return TypeOfSale;
};
