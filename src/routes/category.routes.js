const Router = require('express');
const categoryController = require('../controller/category.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');

router.get('/categories', errorWrapper(categoryController.getCategories));
router.get('/category/change-name', errorWrapper(auth), errorWrapper(categoryController.changeNameCategory));
router.get('/category/disable', errorWrapper(auth), errorWrapper(categoryController.disableCategory));
router.get('/category/create', errorWrapper(auth), errorWrapper(categoryController.createCategory));
module.exports = router;
