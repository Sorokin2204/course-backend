const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const TypeBusiness = db.typeBusiness;

class TypeBusinessController {
  async getTypeBusinessList(req, res) {
    res.json(
      await TypeBusiness.findAll({
        where: {
          active: true,
        },
      }),
    );
  }
  async upsertTypeBusinessList(req, res) {
    const { id, name, disable, margin, marketing, marketingText } = req.body;
    let findTypeBusiness;
    if (id) {
      findTypeBusiness = await TypeBusiness.findOne({
        where: {
          id,
        },
      });
    }

    if (findTypeBusiness) {
      await TypeBusiness.update({ name, margin, marketing, marketingText, ...(disable && { active: false }) }, { where: { id } });
    } else {
      await TypeBusiness.create({ name, margin, marketing, marketingText });
    }
    res.json(true);
  }
}

module.exports = new TypeBusinessController();
