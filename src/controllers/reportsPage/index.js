const { resolvePath, renderPage,formatDate }  = require('../utils.js') 
const config = require('../../config/settings.config.json');

async function getReportPage(req,res){
    renderPage(res, resolvePath('reportsPage', 'reportsHome.ejs'), {
        empCode: req.cookies.empCode,
    });

}

async function showReportsTable(req,res){

    const { startDate, endDate, botId } = req.query;

    const params = {
        botId:botId,
        startDate: startDate,
        endDate: endDate,
        envType: "prd"
    };
    

    const queryString = new URLSearchParams(params).toString();
    const api = `${config.otherAPI.rpaLogs.url}${config.otherAPI.rpaLogs.endPoints.reportsEndpoint}?${queryString}`;

    console.log('api :-',api)
    // Make the GET request using fetch
    const response = await fetch(api);
    console.log(response,"KKKKKKK")
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    // console.log('text :-',text) 
    const responseJson = JSON.parse(text);
    // console.log('responseJson:-',responseJson)
    processLogs = await responseJson.process_logs
    // console.log('processLogs:-',processLogs)
    res.json({ processLogs });

}


async function fetchReports(req,res){
    const { clientName, projectName, startDate, endDate } = req.body;

    formattedStartDate = formatDate(startDate)
    formattedEndDate = formatDate(endDate)

    const startDateObj = new Date(formattedStartDate);
    const endDateObj = new Date(formattedEndDate);

    console.log(formattedStartDate,'--',startDate)
    console.log(formattedEndDate,'--',endDate)

    // Check if startDate is greater than endDate
    if (startDate > endDate) {
        console.log(1234)

        // renderPage(res, resolvePath('reportsPage', 'reportsHome.ejs'), {
        //     empCode: req.cookies.empCode,
        //     message :'Start Date should be smaller than End Date',
        //     alertType : 'danger'
        // });
    }



    // Define the parameters for the API call with formatted dates
    const queryParams = {
        botId:'7328fe32264ecd8533d3c8c9964a2db5d945e37b',
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        envType: "prd"
    };

    res.redirect(`/reports/show-reports?${new URLSearchParams(queryParams).toString()}`);
}


module.exports = {
    getReportPage,
    fetchReports,
    showReportsTable
}