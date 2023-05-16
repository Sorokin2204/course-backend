const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const TypeBusiness = db.typeBusiness;

class TypeBusinessController {
  async getTypeBusinessList(req, res) {
    res.json(await TypeBusiness.findAll());
  }
}

module.exports = new TypeBusinessController();
