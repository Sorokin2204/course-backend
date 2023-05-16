const setupRelationship = (db) => {
  // db.advert.belongsToMany(db.image, { through: { model: db.advertImage, unique: false }, foreignKey: 'advertId' });
  // db.image.belongsToMany(db.advert, { through: { model: db.advertImage, unique: false }, foreignKey: 'imageId' });
  // db.category.hasMany(db.advert);
  // db.advert.belongsTo(db.category);
  // db.advert.hasMany(db.image);
  // db.image.belongsTo(db.advert);
  db.user.hasMany(db.result);
  db.result.belongsTo(db.user);

  db.typeBusiness.hasMany(db.nameBusiness);
  db.nameBusiness.belongsTo(db.typeBusiness);
};

module.exports = setupRelationship;
