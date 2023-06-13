const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const NameBusiness = db.nameBusiness;

class NameBusinessController {
  async getNameBusinessList(req, res) {
    res.json(await NameBusiness.findAll({ where: { active: true } }));
  }
  async upsertNameBusinessList(req, res) {
    const { id, name, disable, typeBusinessId } = req.body;
    let findNameBusiness;
    if (id) {
      findNameBusiness = await NameBusiness.findOne({
        where: {
          id,
        },
      });
    }

    if (findNameBusiness) {
      await NameBusiness.update({ name, typeBusinessId, ...(disable && { active: false }) }, { where: { id } });
    } else {
      await NameBusiness.create({ name, typeBusinessId });
    }
    res.json(true);
  }
}

module.exports = new NameBusinessController();
