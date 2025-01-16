const { resolvePath, renderPage, formatDate, getApiUrl } = require('../utils.js');
const config = require('../../config/settings.config.json');
const apiConfig = require('../../config/dbcredentials.config.json');

async function getPageCountDashboardPage(req, res) {
    renderPage(res, resolvePath('pageCountDashboard', 'pageCountDashboardHome.ejs'), {
        empCode: req.cookies.empCode,
    });
}

async function showPageCount(req, res) {
    const { apiURL, fromDate, toDate } = req.query;

    const params = {
        fromDate: fromDate,
        toDate: toDate
    };

    const queryString = new URLSearchParams(params).toString();
    const api = `${apiURL}?${queryString}`;
    console.log('api :', api);

    const response = await fetch(api);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const responseJson = JSON.parse(text);

    res.json({ responseJson });
}

async function fetchPageCount(req, res) {
    const { clientName, projectName, startDate, endDate } = req.body;

    // Fetch API URL
    const apiURL = getApiUrl(clientName, projectName, 'prd', apiConfig);

    // Format dates
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // Define the parameters for the API call with formatted dates
    const queryParams = {
        apiURL: apiURL,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
    };
    // Redirect to the page count dashboard with query parameters
    res.redirect(`/page-count-dashboard/show-page-count?${new URLSearchParams(queryParams).toString()}`);
}

module.exports = {
    getPageCountDashboardPage,
    fetchPageCount,
    showPageCount
};
