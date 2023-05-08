const Router = require('express');
const pageController = require('../controller/user.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');

router.post('/update', errorWrapper(auth), errorWrapper(pageController.update));

router.post('/file/upload', errorWrapper(pageController.uploadFile));
router.post('/login', errorWrapper(pageController.login));
router.post('/register', errorWrapper(pageController.createUser));
router.get('/auth', errorWrapper(pageController.auth));

module.exports = router;
