const express = require('express');
const { manageProject, addProject, updateProjectPage, getClientNames, getManagerList, getTeamMemberList,storeProjectInfo,showSubmissionDetails,showDetails,getProjectList,showDetailsPage,storeUpdatedInfo } = require('../../controllers/manageProjectPage/index');
const restrictToLoginUserOnly = require('../../middlewares/authentication');


const router = express.Router();

// POST endpoints
router.post('/manage-project', restrictToLoginUserOnly, manageProject)
router.post('/add-project', restrictToLoginUserOnly, addProject)
router.post('/update-project', restrictToLoginUserOnly, updateProjectPage)
router.post('/store-project-info', restrictToLoginUserOnly,storeProjectInfo)
router.post('/show-details', restrictToLoginUserOnly,showDetails)


// GET endpoints
router.get('/api/get-client-names', restrictToLoginUserOnly, getClientNames)
router.get('/api/get-project-names', restrictToLoginUserOnly, getProjectList)
router.get('/api/get-manager-names', restrictToLoginUserOnly, getManagerList)
router.get('/api/get-team-member-names', restrictToLoginUserOnly, getTeamMemberList)
router.get('/submission-details-status',restrictToLoginUserOnly, showSubmissionDetails)
router.get('/show-details-page',restrictToLoginUserOnly,showDetailsPage)
router.get('/updated-details',restrictToLoginUserOnly,storeUpdatedInfo)

module.exports = router;
