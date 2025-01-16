const { resolvePath, renderPage, transpose, formatDate }  = require('../utils.js') 
const { projectInfo } = require('../../models/projectInfo');

async function getPhaseDashboard(req,res){
    renderPage(res, resolvePath('projectPhaseDashboard', 'cardsDashboard.ejs'), {
        empCode: req.cookies.empCode,
    });
}


async function getEmptyBoard(req,res){
    renderPage(res, resolvePath('projectPhaseDashboard', 'emptyBoard.ejs'), {
        empCode: req.cookies.empCode,
    });   
}


async function displayPhaseData(req, res) {
    const phaseSelected = req.query;
    const phaseName = phaseSelected.phaseSelected;
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = 20; // Number of entries per page
    const skip = (page - 1) * limit;

    const projectDetails = await projectInfo.aggregate([
        {
            $match: {
                [`phase.${phaseName}.status`]: 'on-going' // Dynamic phase and status
            }
        },
        {
            $project: {
                projectName: 1,
                clientName: 1,
                resources: 1,
                [`phase.${phaseName}.start_date`]: 1,
                [`phase.${phaseName}.end_date`]: 1,
                _id: 0
            }
        }
    ]);

    

    const clientNames = [];
    const projectNames = [];
    const startDates = [];
    const endDates = [];
    deliveryManagerArray = []
    deliveryTeamMembersArray = []
    salesManagerArray = []
    salesTeamMembersArray = []
    techManagerArray = []
    techTeamMembersArray = []
    testingManagerArray = []
    testingTeamMembersArray = []
    baManagerArray = []
    baTeamMembersArray = []


    projectDetails.forEach((item) => {
        if (item.clientName) {
            clientNames.push(item.clientName);
        }
        if (item.projectName) {
            projectNames.push(item.projectName);
        }
        if (item.phase && item.phase[phaseName]) {
            const phaseData = item.phase[phaseName];
            startDates.push(formatDate(phaseData.start_date));
            endDates.push(formatDate(phaseData.end_date));
        }

        // console.log(item.clientName,':',item.resources.delivery)
        deliveryManagerArray.push(item.resources.delivery.manager)
        deliveryTeamMembersArray.push(item.resources.delivery.teamMembers)

        salesManagerArray.push(item.resources.sales.manager)
        salesTeamMembersArray.push(item.resources.sales.teamMembers)

        techManagerArray.push(item.resources.development.manager)
        techTeamMembersArray.push(item.resources.development.teamMembers)

        testingManagerArray.push(item.resources.testing.manager)
        testingTeamMembersArray.push(item.resources.testing.teamMembers)

        baManagerArray.push(item.resources.businessAnalyst.manager)
        baTeamMembersArray.push(item.resources.businessAnalyst.teamMembers)
    });

    const serialNumbers = clientNames.map((_, index) => index + 1);

    const headerArray = ['Sr. No.', 'Client Name', 'Project Name', 'Start Date', 'End Date','Additonal Information'];
    
    const tableBodyArray = [serialNumbers, clientNames, projectNames, startDates, endDates];
    const transposedData = transpose(tableBodyArray);

    additional_info = [
                        [deliveryManagerArray,deliveryTeamMembersArray],
                        [salesManagerArray,salesTeamMembersArray],
                        [techManagerArray,techTeamMembersArray],
                        [testingManagerArray,testingTeamMembersArray],
                        [baManagerArray,baTeamMembersArray]
                        ]
    // Apply pagination
    const paginatedData = transposedData.slice(skip, skip + limit);
    const totalPages = Math.ceil(transposedData.length / limit);

    renderPage(res, resolvePath('projectPhaseDashboard', 'table.ejs'), {
        empCode: req.cookies.empCode,
        headers: headerArray,
        tableBody: paginatedData,
        currentPage: page,
        totalPages: totalPages,
        phaseName: phaseName,
        additionalInfo: additional_info
    });
}

module.exports = {
    getPhaseDashboard,
    getEmptyBoard,
    displayPhaseData
}