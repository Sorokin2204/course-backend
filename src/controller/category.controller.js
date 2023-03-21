const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { CustomError, TypeError } = require('../models/customError.model');
const Category = db.category;

class CategoryController {
  async getCategories(req, res) {
    const categories = await Category.findAll();
    res.json([...categories, ...categories]);
  }
}

module.exports = new CategoryController();
