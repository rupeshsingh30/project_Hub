import { fetchClientNames, populateDropdown } from './addProject.js';


export async function fetchProjectNames(clientName) {
    try {
        const url = `/project/api/get-project-names?clientName=${encodeURIComponent(clientName)}`;
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching client names:', error);
        return [];
    }
}

function initializeEventListeners() {

    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const form = document.getElementById('updateProjectForm');

    if (form) {
        form.addEventListener('submit', async function(event) {

            console.log(123)
            // event.preventDefault(); // Prevent the default form submission

            const submitButton = event.submitter; // The button that was clicked
            let actionUrl;

            // console.log(clientNameInput,'---',projectNameInput)
            // Capture form data
            const clientName = clientNameInput ? clientNameInput.value : '';
            const projectName = projectNameInput ? projectNameInput.value : '';

            // Determine the URL based on the button clicked
            if (submitButton.id === 'updateDetailsBtn') {
                actionUrl = '/project/show-details'; // Replace with your endpoint
            } else if (submitButton.id === 'submitDetailsBtn') {
                actionUrl = '/project/show-details'; // Replace with your endpoint
            }

            // Create a FormData object
            const formData = new FormData(form);
            formData.append('clientName', clientName);
            formData.append('projectName', projectName);

            // Use Fetch API to submit the form data to the selected endpoint
            fetch(actionUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                // console.log('Success:', data);
                // Handle successful response
                // Optionally, redirect or update the UI as needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error
            });
        });
    }



    if (clientNameInput){
        clientNameInput.addEventListener('click', async function () {
            const clientNames = await fetchClientNames();
            // console.log(clientNames)
            populateDropdown('clientName',clientNames);
        });
    }

    if(projectNameInput){
        projectNameInput.addEventListener('click', async function () {
            const projectNames = await fetchProjectNames(clientNameInput.value);
            // console.log(projectNames)
            populateDropdown('projectName',projectNames);
        })
    }

}


// Initialize event listeners when the document is ready
document.addEventListener('DOMContentLoaded', initializeEventListeners);
