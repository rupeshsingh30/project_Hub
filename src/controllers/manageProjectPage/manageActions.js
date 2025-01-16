const { projectInfo } = require('../../models/projectInfo.js');
const { resolvePath, renderPage, formatDate2, formatDate, processArray }  = require('../utils.js') 


async function manageProject(req, res) {
    renderPage(res, resolvePath('manageProjectPage', 'manageProjectActions.ejs'), { empCode: req.cookies.empCode });
}

async function addProject(req, res) {
    renderPage(res, resolvePath('manageProjectPage', 'addProject.ejs'), { empCode: req.cookies.empCode });
}

async function updateProjectPage(req, res) {
    // Check if the query parameter 'submitted' exists and is 'true'
    const submitted ='false'; // Default to 'false' if not provided

    // Pass the 'submitted' variable to the EJS template
    renderPage(res, resolvePath('manageProjectPage', 'updateProject.ejs'), {
        empCode: req.cookies.empCode,
        submitted: submitted
    });
}


async function showSubmissionDetails(req, res) {
    const { message = '', alertType = '' } = req.session;
    delete req.session.message;
    delete req.session.alertType;

    renderPage(res, resolvePath('manageProjectPage', 'addProject.ejs'), { empCode: req.cookies.empCode, message, alertType });
}



async function storeProjectInfo(req, res) {
    const {
        clientName,
        projectName,
        phase,
        phaseStart,
        phaseEnd,
        deliveryManager,
        deliveryTeamMembers,
        salesManager,
        salesTeamMembers,
        techManager,
        techTeamMembers,
        testingManager,
        testingTeamMembers,
        businessAnalystManager,
        businessAnalystTeamMembers
    } = req.body;

    const phaseStatus = req.body['phase-status-select'];

    const processArrayValue = (value) => {
        if (typeof value === 'string') {
            return value.split(',').map(item => item.trim()).filter(item => item);
        }
        return [];
    };

    const phaseStartFormatted = new Date(phaseStart);
    const phaseEndFormatted = new Date(phaseEnd);

    if (phaseEndFormatted <= phaseStartFormatted) {
        req.session.message = 'End date should be greater than start date';
        req.session.alertType = 'danger';
        return res.redirect('/project/submission-details-status');
    }

    const updatedBy = req.cookies.emailID || '';
    const updatedAt = new Date().toISOString();

    const phases = ['discussion', 'poc', 'dev', 'testing', 'uat', 'prd', 'on_hold'];
    const phaseData = phases.reduce((acc, currentPhase) => {
        acc[currentPhase] = {
            start_date: '',
            end_date: '',
            status: '',
            updatedBy,
            updatedAt
        };
        return acc;
    }, {});

    if (phases.includes(phase)) {
        phaseData[phase] = {
            start_date: phaseStart,
            end_date: phaseEnd,
            status: phaseStatus,
            updatedBy,
            updatedAt
        };
    }

    const project = new projectInfo({
        clientName,
        projectName,
        botId: "defaultBotId", // Replace with actual botId if available
        createdBy: updatedBy,
        createdAt: new Date().toISOString(),
        resources: {
            delivery: {
                manager: processArrayValue(deliveryManager),
                teamMembers: processArrayValue(deliveryTeamMembers)
            },
            development: {
                manager: processArrayValue(techManager),
                teamMembers: processArrayValue(techTeamMembers)
            },
            testing: {
                manager: processArrayValue(testingManager),
                teamMembers: processArrayValue(testingTeamMembers)
            },
            sales: {
                manager: processArrayValue(salesManager),
                teamMembers: processArrayValue(salesTeamMembers)
            },
            businessAnalyst: {
                manager: processArrayValue(businessAnalystManager),
                teamMembers: processArrayValue(businessAnalystTeamMembers)
            }
        },
        phase: phaseData,
    });

    try {
        await project.save();
        req.session.message = 'Successfully saved the project details';
        req.session.alertType = 'success';
    } catch (error) {
        console.error('Error saving project details:', error);
        req.session.message = 'Error saving project details';
        req.session.alertType = 'danger';
    }

    res.redirect('/project/submission-details-status');
}




async function showDetails(req, res) {

    // console.log(req.body)
    const { actionType, clientName, projectName,
        phase,
        phaseStart,
        phaseEnd,
        deliveryManager,
        deliveryTeamMembers,
        salesManager,
        salesTeamMembers,
        techManager,
        techTeamMembers,
        testingManager,
        testingTeamMembers,
        businessAnalystManager,
        businessAnalystTeamMembers } = req.body;

    const phaseStatus = req.body['phase-status-select'];
    
    // console.log('Action Type:', req.body.actionType);

    if (actionType === 'update') {

        let actionUrl = '/project/updated-details';
        actionUrl += `?updatedClientName=${encodeURIComponent(clientName)}`;
        actionUrl += `&updatedProjectName=${encodeURIComponent(projectName)}`;
        actionUrl += `&updatedPhaseName=${encodeURIComponent(phase)}`;
        actionUrl += `&updatedPhaseStatus=${encodeURIComponent(phaseStatus)}`;
        actionUrl += `&updatedPhaseStart=${encodeURIComponent(phaseStart)}`;
        actionUrl += `&updatedPhaseEnd=${encodeURIComponent(phaseEnd)}`;
        actionUrl += `&updatedDeliveryManager=${encodeURIComponent(deliveryManager)}`;
        actionUrl += `&updatedDeliveryTeamMembers=${encodeURIComponent(deliveryTeamMembers)}`;
        actionUrl += `&updatedSalesManager=${encodeURIComponent(salesManager)}`;
        actionUrl += `&updatedSalesTeamMembers=${encodeURIComponent(salesTeamMembers)}`;
        actionUrl += `&updatedTechManager=${encodeURIComponent(techManager)}`;
        actionUrl += `&updatedTechTeamMembers=${encodeURIComponent(techTeamMembers)}`;
        actionUrl += `&updatedTestingManager=${encodeURIComponent(testingManager)}`;
        actionUrl += `&updatedTestingTeamMembers=${encodeURIComponent(testingTeamMembers)}`;
        actionUrl += `&updatedBusinessAnalystManager=${encodeURIComponent(businessAnalystManager)}`;
        actionUrl += `&updatedBusinessAnalystTeamMembers=${encodeURIComponent(businessAnalystTeamMembers)}`;

        // console.log(actionUrl);
        res.redirect(actionUrl)

    } else if (actionType === 'submit') {
        actionUrl = '/project/show-details-page'
        actionUrl += `?clientName=${encodeURIComponent(clientName)}&projectName=${encodeURIComponent(projectName)}`
        res.redirect(actionUrl);
    } else {
        res.status(400).send('Invalid action type');
    }
}


function getPhasesWithStatus(data) {
    // console.log(data);
    const phases = data.phase;
    const activePhases = [];

    for (const [phaseName, phaseDetails] of Object.entries(phases)) {
        if (phaseDetails.start_date && phaseDetails.end_date) {
            activePhases.push({
                phase: phaseName,
                start_date: formatDate(phaseDetails.start_date),
                end_date: formatDate(phaseDetails.end_date),
                status: phaseDetails.status
            });
        }
    }

    return activePhases;
}



async function showDetailsPage(req, res) {
    const clientName = req.query.clientName;
    const projectName = req.query.projectName;

    const projectDetails = await projectInfo.aggregate([
        {
            $match:{
                clientName: clientName,
                projectName: projectName
            }
        },
        {
            $project:{
                _id:0
            }
        }

    ])

    const activePhases = getPhasesWithStatus(projectDetails[0]);
    const lastPhase = activePhases[activePhases.length - 1];

    // If you want to access specific properties
    const previousPhaseName = lastPhase.phase;
    const previousStartDate = formatDate2(lastPhase.start_date);
    const previousEndDate = formatDate2(lastPhase.end_date);
    const previousStatus = lastPhase.status;


    techTeamManagers = processArray(projectDetails[0].resources.development.manager)
    techTeamTeamMembers = processArray(projectDetails[0].resources.development.teamMembers)
    
    deliveryTeamManagers = processArray(projectDetails[0].resources.delivery.manager)
    deliveryTeamTeamMembers = processArray(projectDetails[0].resources.delivery.teamMembers)

    testingTeamManagers = processArray(projectDetails[0].resources.testing.manager)
    testingTeamTeamMembers = processArray(projectDetails[0].resources.testing.teamMembers)

    salesTeamManagers = processArray(projectDetails[0].resources.sales.manager)
    salesTeamTeamMembers = processArray(projectDetails[0].resources.sales.teamMembers)

    businessAnalystTeamManagers = processArray(projectDetails[0].resources.businessAnalyst.manager)
    businessAnalystTeamTeamMembers = processArray(projectDetails[0].resources.businessAnalyst.teamMembers)

    renderPage(res, resolvePath('manageProjectPage', 'updateProject.ejs'), {
        empCode: req.cookies.empCode,
        submitted: 'true',
        clientName,
        projectName,
        techTeamManagers,
        techTeamTeamMembers,
        deliveryTeamManagers,
        deliveryTeamTeamMembers,
        testingTeamManagers,
        testingTeamTeamMembers,
        salesTeamManagers,
        salesTeamTeamMembers,
        businessAnalystTeamManagers,
        businessAnalystTeamTeamMembers,
        activePhases,
        previousPhaseName,
        previousStartDate,
        previousEndDate,
        previousStatus
    });
}



async function storeUpdatedInfo(req,res){

    const {
        updatedClientName,
        updatedProjectName,
        updatedPhaseName,
        updatedPhaseStatus,
        updatedPhaseStart,
        updatedPhaseEnd,
        updatedDeliveryManager,
        updatedDeliveryTeamMembers,
        updatedSalesManager,
        updatedSalesTeamMembers,
        updatedTechManager,
        updatedTechTeamMembers,
        updatedTestingManager,
        updatedTestingTeamMembers,
        updatedBusinessAnalystManager,
        updatedBusinessAnalystTeamMembers
    } = req.query;

    const projectDetails = await projectInfo.findOne({
        clientName: updatedClientName,
        projectName: updatedProjectName
    });


    const existingPhaseDetails = projectDetails.phase[updatedPhaseName];

    // If information of new phase is to be stored
    if (existingPhaseDetails.status === '') {

        projectDetails.phase[updatedPhaseName].start_date = updatedPhaseStart
        projectDetails.phase[updatedPhaseName].end_date = updatedPhaseEnd
        projectDetails.phase[updatedPhaseName].status = updatedPhaseStatus
        projectDetails.phase[updatedPhaseName].updatedBy = req.cookies.emailID
        projectDetails.phase[updatedPhaseName].updatedAt = new Date().toISOString()
    }
    else if(existingPhaseDetails.status !==''){

        // if dates are changed but phase status is same then store the previous dates and other details in history
        // and  update the phase information 
        if (existingPhaseDetails.start_date !== updatedPhaseStart || existingPhaseDetails.end_date !== updatedPhaseEnd){
            await existingPhaseDetails.history.push({
                start_date:existingPhaseDetails.start_date,
                end_date:existingPhaseDetails.end_date,
                status:existingPhaseDetails.status,
                updatedBy:existingPhaseDetails.updatedBy,
                updatedAt:existingPhaseDetails.updatedAt             
            })

            existingPhaseDetails.start_date = updatedPhaseStart
            existingPhaseDetails.end_date = updatedPhaseEnd
            existingPhaseDetails.status = updatedPhaseStatus
            existingPhaseDetails.updatedBy = req.cookies.emailID
            existingPhaseDetails.updatedAt = new Date().toISOString()
        }

        // if phase dates are same but status is changed i.e on-going is modified to completed
        // then just update the phase details and no need to store anything is history array
        else if(existingPhaseDetails.status !== updatedPhaseStatus){

            existingPhaseDetails.start_date = updatedPhaseStart
            existingPhaseDetails.end_date = updatedPhaseEnd
            existingPhaseDetails.status = updatedPhaseStatus
            existingPhaseDetails.updatedBy = req.cookies.emailID
            existingPhaseDetails.updatedAt = new Date().toISOString()
        }
    }

    projectDetails.resources.delivery.manager = updatedDeliveryManager || projectDetails.resources.delivery.manager;
    projectDetails.resources.delivery.teamMembers = updatedDeliveryTeamMembers || projectDetails.resources.delivery.teamMembers;
    projectDetails.resources.development.manager = updatedTechManager || projectDetails.resources.development.manager;
    projectDetails.resources.development.teamMembers = updatedTechTeamMembers || projectDetails.resources.development.teamMembers;
    projectDetails.resources.testing.manager = updatedTestingManager || projectDetails.resources.testing.manager;
    projectDetails.resources.testing.teamMembers = updatedTestingTeamMembers || projectDetails.resources.testing.teamMembers;
    projectDetails.resources.sales.manager = updatedSalesManager || projectDetails.resources.sales.manager;
    projectDetails.resources.sales.teamMembers = updatedSalesTeamMembers || projectDetails.resources.sales.teamMembers;
    projectDetails.resources.businessAnalyst.manager = updatedBusinessAnalystManager || projectDetails.resources.businessAnalyst.manager;
    projectDetails.resources.businessAnalyst.teamMembers = updatedBusinessAnalystTeamMembers || projectDetails.resources.businessAnalyst.teamMembers;

    projectDetails.clientName = updatedClientName;
    projectDetails.projectName = updatedProjectName;

    await projectDetails.save()

    renderPage(res, resolvePath('manageProjectPage', 'updateProject.ejs'), {
        empCode: req.cookies.empCode,
        submitted: 'false',
    });

}


module.exports = {
    manageProject,
    addProject,
    updateProjectPage,
    showDetails,
    showDetailsPage,
    showSubmissionDetails,
    storeProjectInfo,
    storeUpdatedInfo
}
