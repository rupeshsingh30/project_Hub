const express = require('express');
const {homePage } = require('../../controllers/homePage/index');
const restrictToLoginUserOnly = require('../../middlewares/authentication');

const router = express.Router();


router.get('/homepage',restrictToLoginUserOnly,homePage)



module.exports = router;
