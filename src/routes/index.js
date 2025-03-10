const express = require('express');
const router = express.Router();

// Import feature-specific routers
const loginPageRouter = require('./loginPage');
const homePageRouter = require('./homePage');
const manageProjectPageRouter = require('./manageProjectPage');
const pageCountDashboardRouter = require('./pageCountDashboard');
const projectPhaseDashboardRouter = require('./projectPhaseDashboard');
const taskboardPageRouter = require('./taskboardPage');
const reportsPageRouter = require('./reportsPage');
const licensePageRouter = require('./licenseExpirypage')


// Use feature-specific routers
router.use('/', loginPageRouter);
router.use('/home', homePageRouter);
router.use('/project', manageProjectPageRouter);
router.use('/page-count-dashboard', pageCountDashboardRouter);
router.use('/project-phases', projectPhaseDashboardRouter);
router.use('/taskboard',taskboardPageRouter)
router.use('/reports',reportsPageRouter)
router.use('/license',licensePageRouter)


module.exports = router;
