const Router = require('express');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');
const whereSaleController = require('../controller/whereSale.controller');
const resultController = require('../controller/result.controller');

router.post('/result', errorWrapper(resultController.upsertResultUser));
router.get('/result', errorWrapper(resultController.getResult));
module.exports = router;
