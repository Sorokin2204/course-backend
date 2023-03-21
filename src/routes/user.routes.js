const Router = require('express');
const pageController = require('../controller/user.controller');

const router = new Router();
const auth = require('../middleware/auth');
const { errorWrapper } = require('../middleware/customError');

router.post('/update', errorWrapper(auth), errorWrapper(pageController.update));
router.post('/advert/add', errorWrapper(auth), errorWrapper(pageController.createAdvert));
router.post('/file/upload', errorWrapper(pageController.uploadFile));
router.post('/login', errorWrapper(pageController.login));
router.post('/register', errorWrapper(pageController.createUser));
router.get('/auth', errorWrapper(pageController.auth));
router.get('/advert/user', errorWrapper(auth), errorWrapper(pageController.getAdvertUser));
router.get('/advert/search', errorWrapper(pageController.searchAdvert));
router.get('/advert/change-status', errorWrapper(auth), errorWrapper(pageController.changeStatus));
router.get('/advert/list', errorWrapper(pageController.getListAdvert));
router.get('/advert/:id', errorWrapper(pageController.getSingleAdvert));
router.post('/advert/update/:advertId', errorWrapper(auth), errorWrapper(pageController.updateAdvert));
router.get('/category/:id', errorWrapper(pageController.getCategory));
module.exports = router;
