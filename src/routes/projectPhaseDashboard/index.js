const express = require('express');
const {getPhaseDashboard,getEmptyBoard,displayPhaseData} = require('../../controllers/projectPhaseDashboard');
const restrictToLoginUserOnly = require('../../middlewares/authentication');

const router = express.Router();


// GET endpoints
router.get('/home-dashboard', restrictToLoginUserOnly, getPhaseDashboard)
router.get('/home-emptyBoard', restrictToLoginUserOnly, getEmptyBoard)
router.get('/display-phase-data', restrictToLoginUserOnly, displayPhaseData)



module.exports = router;