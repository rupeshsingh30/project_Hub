const express = require('express');
const {getReportPage,fetchReports,showReportsTable} = require('../../controllers/reportsPage');
const restrictToLoginUserOnly = require('../../middlewares/authentication');

const router = express.Router();


// GET endpoints
router.get('/reports-home', restrictToLoginUserOnly, getReportPage)
router.get('/show-reports', restrictToLoginUserOnly,showReportsTable)
// POST endpoints
router.post('/fetch-reports', restrictToLoginUserOnly, fetchReports)



module.exports = router;