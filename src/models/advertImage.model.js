module.exports = (sequelize, Sequelize) => {
  const AdvertImage = sequelize.define('advertImage', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
  return AdvertImage;
};
