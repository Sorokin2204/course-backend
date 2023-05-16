const Router = require('express');
const pageController = require('../controller/user.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');
const typeOfSaleController = require('../controller/typeOfSale.controller');

router.get('/type-sale', errorWrapper(typeOfSaleController.getTypeOfSaleList));

module.exports = router;
