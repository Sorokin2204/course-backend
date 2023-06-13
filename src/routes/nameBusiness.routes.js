const Router = require('express');
const pageController = require('../controller/user.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');
const nameBusinessController = require('../controller/nameBusiness.controller');

router.get('/name-business', errorWrapper(nameBusinessController.getNameBusinessList));
router.post('/name-business', errorWrapper(nameBusinessController.upsertNameBusinessList));
module.exports = router;
