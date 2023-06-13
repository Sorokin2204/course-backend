module.exports = (sequelize, Sequelize) => {
  const TypeBusiness = sequelize.define('typeBusiness', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    margin: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    marketing: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    marketingText: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return TypeBusiness;
};
