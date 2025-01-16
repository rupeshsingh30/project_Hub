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
        processLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.executionId}</td>
                <td>${formatDateOnly(log.createdAt)}</td>
                <td>${extractTime(new Date(log.startTime).toLocaleString())}</td>
                <td>${extractTime(new Date(log.endTime).toLocaleString())}</td>
                <td>${log.duration}</td>
                <td>${log.status}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="6">No reports available</td></tr>';
    }
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

function updatePaginationVisibility() {
    const paginationButtons = document.querySelector('.pagination-buttons');
    if (processLogs.length > recordsPerPage) {
        paginationButtons.style.display = 'block';
    } else {
        paginationButtons.style.display = 'none';
    }
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
        const response = await fetch('/reports/fetch-reports', {
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

        if (!response.ok) {
            loader.style.display = 'none';
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${text}`);
        }

        const data = await response.json();
        console.log(data,"reportspage js")
        loader.style.display = 'none';
        processLogs = data.processLogs || []; // Ensure it's an array
        currentPage = 1; // Reset to page 1 on successful fetch

        displayRecords(); // Display records for the first page
        updatePaginationVisibility(); // Update visibility of pagination buttons
        updatePageNumbers(); // Update page numbers display

    } catch (error) {
        loader.style.display = 'none';
        console.error('Fetch error:', error);
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
        
        tableBody.innerHTML = ''; // Clear existing rows
        showReportData();
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
