const express = require('express');
const { getLoginPage,verifyLogin } = require('../../controllers/loginPage/index');
const restrictToLoginUserOnly = require('../../middlewares/authentication');


const router = express.Router();

router.get('/', getLoginPage);
router.post('/homePage',verifyLogin)


module.exports = router;
