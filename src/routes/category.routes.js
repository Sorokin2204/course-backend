const Router = require('express');
const categoryController = require('../controller/category.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');

router.get('/categories', errorWrapper(categoryController.getCategories));

module.exports = router;
