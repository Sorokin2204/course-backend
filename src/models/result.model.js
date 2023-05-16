module.exports = (sequelize, Sequelize) => {
  const Result = sequelize.define('result', {
    data: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    step: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Result;
};
