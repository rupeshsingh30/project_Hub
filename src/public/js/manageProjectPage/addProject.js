// Function to fetch client names from the server
export async function fetchClientNames() {
    try {
        const response = await fetch('/project/api/get-client-names', { method: 'GET' });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching client names:', error);
        return [];
    }
}

export function populateDropdown(teamMembersId, options) {
    const input = document.getElementById(teamMembersId);
    const dropdown = document.getElementById(`${teamMembersId}Dropdown`);

    if (!input || !dropdown) {
        console.error('Input or Dropdown element not found');
        return;
    }

    function filterOptions(query) {
        return options.filter(option => option.toLowerCase().includes(query.toLowerCase()));
    }

    function displayDropdown(filteredOptions) {
        dropdown.innerHTML = ''; // Clear previous results

        if (filteredOptions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        filteredOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.textContent = option;
            optionElement.style.padding = '8px';
            optionElement.style.cursor = 'pointer';
            optionElement.addEventListener('click', () => selectItem(option));
            dropdown.appendChild(optionElement);
        });

        dropdown.style.display = 'block'; // Show dropdown when there are suggestions
    }

    function selectItem(item) {
        input.value = item; // Update the textbox value with the selected item
        dropdown.style.display = 'none'; // Hide dropdown after selection
    }

    input.addEventListener('input', () => {
        const userInput = input.value.trim();
        const filteredOptions = filterOptions(userInput);
        displayDropdown(filteredOptions);
    });

    input.addEventListener('focus', () => {
        if (input.value.trim() !== '') {
            const filteredOptions = filterOptions(input.value.trim());
            displayDropdown(filteredOptions);
        } else {
            dropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && event.target !== input) {
            dropdown.style.display = 'none';
        }
    });

    input.addEventListener('blur', () => {
        // Optionally, you can add a delay to allow clicks to be registered
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200);
    });
}


// export function populateDropdown(teamMembersId, options) {
//     const input = document.getElementById(teamMembersId);
//     const dropdown = document.getElementById(`${teamMembersId}Dropdown`);

//     if (!input || !dropdown) {
//         console.error('Input or Dropdown element not found');
//         return;
//     }

//     dropdown.innerHTML = ''; // Clear previous results

//     options.forEach(option => {
//         const optionElement = document.createElement('div');
//         optionElement.textContent = option;
//         optionElement.style.padding = '8px';
//         optionElement.style.cursor = 'pointer';
//         optionElement.addEventListener('click', () => selectItem(option));
//         dropdown.appendChild(optionElement);
//     });

//     input.addEventListener('focus', () => {
//         dropdown.style.display = 'block';
//     });

//     document.addEventListener('click', (event) => {
//         if (!dropdown.contains(event.target) && event.target !== input) {
//             dropdown.style.display = 'none';
//         }
//     });

//     let selectedItem = null; // Changed to allow only one selected item

//     function selectItem(item) {
//         selectedItem = item; // Set the selected item
//         updateTextbox();
//         dropdown.style.display = 'none'; // Hide dropdown after selection
//     }

//     function updateTextbox() {
//         input.value = selectedItem || ''; // Display the selected item in the textbox
//     }

//     input.addEventListener('blur', () => {
//         if (options.includes(input.value.trim())) {
//             selectedItem = input.value.trim(); // Update selected item
//         } else {
//             selectedItem = null; // Clear selection if the value is not in options
//         }
//         updateTextbox();
//     });
// }




// Function to handle hiding the dropdown if clicked outside
export function setupClickOutsideHandler(dropdownId, mainId) {
    document.addEventListener('click', function (e) {
        const clientNameInput = document.getElementById(mainId);
        const dropdown = document.getElementById(dropdownId);

        if (!clientNameInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

export async function getManagerList(managerType) {
    const url = `/project/api/get-manager-names?managerType=${managerType}`;

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

export async function getTeamMemberList(managerId) {
    const managerName = document.getElementById(managerId).value;
    const url = `/project/api/get-team-member-names?managerName=${managerName}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

export function setupDropdown(teamMembersId, options) {
    const input = document.getElementById(teamMembersId);
    const dropdown = document.getElementById(`${teamMembersId}Dropdown`);

    if (!input || !dropdown) {
        console.error('Input or Dropdown element not found');
        return;
    }

    dropdown.innerHTML = ''; // Clear previous results

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option;
        optionElement.style.padding = '8px';
        optionElement.style.cursor = 'pointer';
        optionElement.addEventListener('click', () => selectItem(option));
        dropdown.appendChild(optionElement);
    });

    input.addEventListener('focus', () => {
        dropdown.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && event.target !== input) {
            dropdown.style.display = 'none';
        }
    });

    let selectedItems = [];

    function selectItem(item) {
        if (selectedItems.includes(item)) {
            selectedItems = selectedItems.filter(selected => selected !== item);
        } else {
            selectedItems.push(item);
        }
        updateTextbox();
    }

    function updateTextbox() {
        input.value = selectedItems.join(', ');
    }

    input.addEventListener('blur', () => {
        const inputValue = input.value.split(',').map(name => name.trim());
        selectedItems = inputValue.filter(name => options.includes(name));
        updateTextbox();
    });
}

// Function to initialize event listeners
function initializeEventListeners() {

    const clientNameInput = document.getElementById('clientName');

    clientNameInput.addEventListener('click', async function () {
        const clientNames = await fetchClientNames();
        populateDropdown('clientName',clientNames);
    });

    // Managers Dropdown List
    const deliveryManager = document.getElementById('deliveryManager');
    const salesManager = document.getElementById('salesManager');
    const techManager = document.getElementById('techManager');
    const testingManager = document.getElementById('testingManager');
    const businessAnalystManager = document.getElementById('businessAnalystManager');
    
    if(deliveryManager){
    deliveryManager.addEventListener('click', async function () {
        const deliveryManagerNames = await getManagerList('deliveryManager');
        setupDropdown('deliveryManager', deliveryManagerNames);
    });
    }

    if(salesManager){
    salesManager.addEventListener('click', async function () {
        const salesManagerNames = await getManagerList('salesManager');
        setupDropdown('salesManager', salesManagerNames);
    });
    }

    if(techManager){
    techManager.addEventListener('click', async function () {
        const techManagerNames = await getManagerList('techManager');
        setupDropdown('techManager', techManagerNames);
    });
    }

    if(testingManager){
    testingManager.addEventListener('click', async function () {
        const testingManagerNames = await getManagerList('testingManager');
        setupDropdown('testingManager', testingManagerNames);
    });
    }

    if(businessAnalystManager){
    businessAnalystManager.addEventListener('click', async function () {
        const businessAnalystManagerNames = await getManagerList('businessAnalystManager');
        setupDropdown('businessAnalystManager', businessAnalystManagerNames);
    });
    }

    // Team members Dropdown List
    const deliveryTeamMembers = document.getElementById('deliveryTeamMembers');
    const salesTeamMembers = document.getElementById('salesTeamMembers');
    const techTeamMembers = document.getElementById('techTeamMembers');
    const testingTeamMembers = document.getElementById('testingTeamMembers');
    const businessAnalystTeamMembers = document.getElementById('businessAnalystTeamMembers');
    

    if (deliveryTeamMembers){
    deliveryTeamMembers.addEventListener('click', async function () {
        const deliveryTeamMemberList = await getTeamMemberList('deliveryManager');
        setupDropdown('deliveryTeamMembers', deliveryTeamMemberList);
    });
    }

    if (salesTeamMembers){
    salesTeamMembers.addEventListener('click', async function () {
        const salesTeamMemberList = await getTeamMemberList('salesManager');
        setupDropdown('salesTeamMembers', salesTeamMemberList);
    });
    }   

    if(techTeamMembers){
    techTeamMembers.addEventListener('click', async function () {
        const techTeamMemberList = await getTeamMemberList('techManager');
        setupDropdown('techTeamMembers', techTeamMemberList);
    });
    }

    if (testingTeamMembers){
    testingTeamMembers.addEventListener('click', async function () {
        const testingTeamMemberList = await getTeamMemberList('testingManager');
        setupDropdown('testingTeamMembers', testingTeamMemberList);
    });
    }

    if(businessAnalystTeamMembers){
    businessAnalystTeamMembers.addEventListener('click', async function () {
        const businessAnalystTeamMemberList = await getTeamMemberList('businessAnalystManager');
        setupDropdown('businessAnalystTeamMembers', businessAnalystTeamMemberList);
    });
    }



    // setupClickOutsideHandler('clientNameDropdown', 'clientName');
    // setupClickOutsideHandler('deliveryManagerDropdown', 'deliveryManager');
    // setupClickOutsideHandler('salesManagerDropdown', 'salesManager');
    // setupClickOutsideHandler('techManagerDropdown', 'techManager');
    // setupClickOutsideHandler('testingManagerDropdown', 'testingManager');
    // setupClickOutsideHandler('businessAnalystManagerDropdown', 'businessAnalystManager');
}

// Initialize event listeners when the document is ready
document.addEventListener('DOMContentLoaded', initializeEventListeners);

// module.exports = {
//     fetchClientNames,
//     populateDropdown,
//     setupDropdown,
//     setupClickOutsideHandler,
//     getManagerList,
//     getTeamMemberList,
//     initializeEventListeners
// };
