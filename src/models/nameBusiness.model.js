module.exports = (sequelize, Sequelize) => {
  const NameBusiness = sequelize.define('nameBusiness', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return NameBusiness;
};
