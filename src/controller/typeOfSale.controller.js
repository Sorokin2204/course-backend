const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const TypeOfSale = db.typeOfSale;

class TypeOfSaleController {
  async getTypeOfSaleList(req, res) {
    res.json(await TypeOfSale.findAll());
  }
}

module.exports = new TypeOfSaleController();
