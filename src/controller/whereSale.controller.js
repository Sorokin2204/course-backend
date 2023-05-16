const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const WhereSale = db.whereSale;

class WhereSaleController {
  async getWhereSaleList(req, res) {
    res.json(await WhereSale.findAll());
  }
}

module.exports = new WhereSaleController();
