const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { CustomError, TypeError } = require('../models/customError.model');
const Category = db.category;

class CategoryController {
  async getCategories(req, res) {
    const categories = await Category.findAll({ where: { active: true } });
    res.json(categories);
  }
  async changeNameCategory(req, res) {
    if (res.locals.userData?.role == 'admin') {
      const { newName, categoryId } = req.query;
      await Category.update({ name: newName }, { where: { id: categoryId } });
      res.json(true);
    } else {
      throw new CustomError();
    }
  }
  async createCategory(req, res) {
    if (res.locals.userData?.role == 'admin') {
      const { name } = req.query;
      await Category.create({ name: name });
      res.json(true);
    } else {
      throw new CustomError();
    }
  }
  async disableCategory(req, res) {
    if (res.locals.userData?.role == 'admin') {
      const { categoryId } = req.query;
      await Category.update({ active: false }, { where: { id: categoryId } });
      res.json(true);
    } else {
      throw new CustomError();
    }
  }
}

module.exports = new CategoryController();
