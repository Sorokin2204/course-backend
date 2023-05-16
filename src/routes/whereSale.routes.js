const Router = require('express');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');
const whereSaleController = require('../controller/whereSale.controller');

router.get('/where-sale', errorWrapper(whereSaleController.getWhereSaleList));

module.exports = router;
