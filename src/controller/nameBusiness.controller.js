const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const NameBusiness = db.nameBusiness;

class NameBusinessController {
  async getNameBusinessList(req, res) {
    res.json(await NameBusiness.findAll());
  }
}

module.exports = new NameBusinessController();
