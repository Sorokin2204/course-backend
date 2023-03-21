module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('image', {
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isMain: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Image;
};
