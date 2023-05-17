module.exports = (sequelize, Sequelize) => {
  const Result = sequelize.define('result', {
    data: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    },
    step: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    chapter: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Result;
};
