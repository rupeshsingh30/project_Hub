import { fetchClientNames, populateDropdown } from '../manageProjectPage/addProject.js';
import { fetchProjectNames } from '../manageProjectPage/updateProject.js';

let currentPage = 1; // Track current page number
const recordsPerPage = 10; // Number of records per page
let processLogs = []; // Array to store fetched process logs

function formatDateOnly(dateString) {
    const date = new Date(dateString);

    // Define month names
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Extract date components
    const day = date.getUTCDate(); // Day of the month
    const month = date.getUTCMonth(); // Month index (0-based)
    const year = date.getUTCFullYear(); // Full year

    // Format day and month
    const formattedDay = day;
    const formattedMonth = months[month];
    const formattedYear = year;

    // Combine into desired format
    return `${formattedDay}-${formattedMonth}-${formattedYear}`; // e.g., 1-Aug-2024
}

function extractTime(dateTimeString) {
    // Split the dateTimeString by space
    const parts = dateTimeString.split(' ');

    // Check if we have enough parts to get the time
    if (parts.length >= 2) {
        return `${parts[1]} ${parts[2]}`; // The time part is always the second part
    } else {
        throw new Error('Invalid date-time string');
    }
}

function updateTable(processLogs) {
    // Function to update your table based on processLogs
    const tableBody = document.getElementById('reportsTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(processLogs) && processLogs.length > 0) {
        processLogs.forEach((log, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.clientName}</td>
                <td>${log.projectName}</td>
                <td>${log.startDate}</td>
                <td>${log.endDate}</td>
                <td>${log.responseJson.pageCount}</td>
                <td>
                    <button id="downloadBtn${index}" class="download-btn">Download</button>
                </td>
            `;

            tableBody.appendChild(row);

            // Add event listener for the download button
            const downloadBtn = document.getElementById(`downloadBtn${index}`);
            downloadBtn.addEventListener('click', () => {
                const jsonData = log.responseJson.data; // Extract the data array
                const fileName = `report_${log.clientName}_${log.projectName}.xlsx`; // Customize filename
                downloadJsonArrayAsExcel(jsonData, fileName);
            });
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="6">No reports available</td></tr>';
    }
}

// Function to download a JSON array as Excel
function downloadJsonArrayAsExcel(jsonArray, fileName) {
    if (!Array.isArray(jsonArray)) {
        console.error('Invalid data format. Expected an array.');
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(jsonArray); // Convert JSON array to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Append worksheet to workbook
    XLSX.writeFile(workbook, fileName); // Trigger the download
}

function displayRecords() {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedLogs = processLogs.slice(startIndex, endIndex);
    updateTable(paginatedLogs);
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage * recordsPerPage >= processLogs.length;
}

function updatePageNumbers() {
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    const totalPages = Math.ceil(processLogs.length / recordsPerPage);
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayRecords();
        updatePageNumbers();
    }
}

function nextPage() {
    if (currentPage * recordsPerPage < processLogs.length) {
        currentPage++;
        displayRecords();
        updatePageNumbers();
    }
}

async function showReportData() {
    const clientName = document.getElementById('clientName').value;
    const projectName = document.getElementById('projectName').value;
    const startDate = document.getElementById('phaseStart').value;
    const endDate = document.getElementById('reportEndDate').value;
    const loader = document.getElementById('customLoader');

    loader.style.display = 'flex'; // Display loader

    try {
        const response = await fetch('/page-count-dashboard/page-count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientName,
                projectName,
                startDate,
                endDate
            })
        });
        console.log('controller :', response)
        if (!response.ok) {
            loader.style.display = 'none';
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${text}`);
        }

        const data = await response.json();
        data['clientName'] = clientName
        data['projectName'] = projectName
        data['startDate'] = startDate
        data['endDate'] = endDate
        loader.style.display = 'none';
        processLogs = [data]; // Ensure it's an array
        currentPage = 1; // Reset to page 1 on successful fetch

        displayRecords(); // Display records for the first page
    } catch (error) {
        loader.style.display = 'none';
        console.error('Fetch error:', error);
    }
}

function checkDate(startDate, endDate) {
    if (startDate > endDate) {
        return false
    } else {
        return true
    }
}

function initializeEventListeners() {
    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const searchBtn = document.getElementById('searchBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const tableBody = document.getElementById('reportsTableBody');


    if (clientNameInput) {
        clientNameInput.addEventListener('click', async function () {
            const clientNames = await fetchClientNames();
            populateDropdown('clientName', clientNames);
        });
    }

    if (projectNameInput) {
        projectNameInput.addEventListener('click', async function () {
            const projectNames = await fetchProjectNames(clientNameInput.value);
            populateDropdown('projectName', projectNames);
        });
    }

    searchBtn.addEventListener('click', async () => {
        const startDate = document.getElementById('phaseStart').value;
        const endDate = document.getElementById('reportEndDate').value;
        tableBody.innerHTML = ''; // Clear existing rows

        if (checkDate(startDate, endDate)) {
            showReportData();
        } else {
            alert("Start date cannot be greater than the end date.");
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * recordsPerPage < processLogs.length) {
            nextPage();
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            previousPage();
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeEventListeners);
