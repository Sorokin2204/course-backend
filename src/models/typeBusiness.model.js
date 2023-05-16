module.exports = (sequelize, Sequelize) => {
  const TypeBusiness = sequelize.define('typeBusiness', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return TypeBusiness;
};
