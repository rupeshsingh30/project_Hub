const express = require('express');
const {getTaskCards} = require('../../controllers/taskboardPage');
const restrictToLoginUserOnly = require('../../middlewares/authentication');

const router = express.Router();

// GET endpoints
router.get('/tasks-main', restrictToLoginUserOnly, getTaskCards)

module.exports = router;