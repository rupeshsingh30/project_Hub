const express = require('express');
const {getPageCountDashboardPage, fetchPageCount,showPageCount} = require('../../controllers/pageCountDashboard');
const restrictToLoginUserOnly = require('../../middlewares/authentication');

const router = express.Router();


// GET endpoints
router.get('/home', restrictToLoginUserOnly, getPageCountDashboardPage)
router.get('/show-page-count', restrictToLoginUserOnly, showPageCount)

// POST endpoints
router.post('/page-count', restrictToLoginUserOnly, fetchPageCount)


module.exports = router;