const manageActions = require('./manageActions');
const projectDetails = require('./projectDetails');


module.exports = {
    manageProject: manageActions.manageProject,
    addProject: manageActions.addProject,
    updateProjectPage: manageActions.updateProjectPage,
    getClientNames: projectDetails.getClientNames,
    getProjectList: projectDetails.getProjectList,
    getManagerList: projectDetails.getManagerList,
    getTeamMemberList: projectDetails.getTeamMemberList,
    storeProjectInfo: manageActions.storeProjectInfo,
    showSubmissionDetails: manageActions.showSubmissionDetails,
    showDetailsPage: manageActions.showDetailsPage,
    storeUpdatedInfo: manageActions.storeUpdatedInfo,
    showDetails: manageActions.showDetails
};
