const path = require('path');

function processArray(array) {
    if (array.length === 1) {
        // If array has only one element, return it as a string
        return array[0];
    } else if (array.length > 1) {
        // If array has more than one element, join them with a comma
        return array.join(', ');
    } else {
        // Handle case for empty array if needed
        return '';
    }
}

function getApiUrl(clientName, projectName, env, jsonData) {
    // Step 1: Format clientName and projectName
    const formattedClient = clientName.trim().toLowerCase();
    const formattedProject = projectName.trim().toLowerCase().replace(/\s+/g, '');

    // Step 2: Construct the key
    const key = `${formattedClient}-${formattedProject}`;

    // Step 3: Fetch the "api" value for the key
    if (jsonData[key] && jsonData[key][env] && jsonData[key][env].api) {
        return jsonData[key][env].api;
    }

    // Step 4: Return a message if "api" is not found
    return `API not found for key: ${key}`;
}


function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function formatDate2(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
}


// Helper function to resolve paths
const resolvePath = (folder, file) => path.join(__dirname, `./../public/views/${folder}`, file);


// Render main partial view with common variables
const renderPage = (res, mainPartial, options = {}) => {
    res.render(resolvePath('homePage', 'homePage.ejs'), {
        mainPartial,
        empCode: options.empCode || '',
        message: options.message || '',
        data: options.data || '',
        alertType: options.alertType || '',
        submitted: options.submitted || '',
        clientName: options.clientName || '',
        projectName: options.projectName || '',
        techTeamManagers: options.techTeamManagers||'',
        techTeamTeamMembers: options.techTeamTeamMembers||'',
        deliveryTeamManagers: options.deliveryTeamManagers||'',
        deliveryTeamTeamMembers: options.deliveryTeamTeamMembers||'',
        testingTeamManagers: options.testingTeamManagers||'',
        testingTeamTeamMembers: options.testingTeamTeamMembers||'',
        salesTeamManagers: options.salesTeamManagers||'',
        salesTeamTeamMembers: options.salesTeamTeamMembers||'',
        businessAnalystTeamManagers: options.businessAnalystTeamManagers||'',
        businessAnalystTeamTeamMembers: options.businessAnalystTeamTeamMembers||'',
        phases: options.activePhases|| '',
        previousPhaseName: options.previousPhaseName|| '',
        previousStartDate: options.previousStartDate||'',
        previousEndDate: options.previousEndDate||'',
        previousStatus: options.previousStatus|| '',
        defaultValue: options.defaultValue|| '',
        headers: options.headers|| '',
        tableBody: options.tableBody|| '',
        currentPage: options.currentPage|| '',
        totalPages: options.totalPages || '',
        phaseName: options.phaseName|| '',
        additionalInfo: options.additionalInfo|| '',
        processLogs: options.processLogs || [],
    });
};


function transpose(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

module.exports = {
    processArray,
    getApiUrl,
    formatDate,
    formatDate2,
    resolvePath,
    renderPage,
    transpose
}