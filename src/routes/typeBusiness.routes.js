const Router = require('express');
const pageController = require('../controller/user.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');
const typeBusinessController = require('../controller/typeBusiness.controller');

router.get('/type-business', errorWrapper(typeBusinessController.getTypeBusinessList));

module.exports = router;
