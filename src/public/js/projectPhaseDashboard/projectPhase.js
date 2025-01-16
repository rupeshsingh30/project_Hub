document.addEventListener('DOMContentLoaded', () => {
    $('#myModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const rowIndex = button.data('row-index'); // Extract info from data-* attributes
        
        // Set content in the modal
        $('#collapse1 .card-body').html(`
            <p><strong>Manager:</strong> ${button.data('delivery-manager')}</p>
            <p><strong>Team Members:</strong> ${button.data('delivery-team-members')}</p>
        `);

        $('#collapse2 .card-body').html(`
            <p><strong>Manager:</strong> ${button.data('sales-manager')}</p>
            <p><strong>Team Members:</strong> ${button.data('sales-team-members')}</p>
        `);

        $('#collapse3 .card-body').html(`
            <p><strong>Manager:</strong> ${button.data('tech-manager')}</p>
            <p><strong>Team Members:</strong> ${button.data('tech-team-members')}</p>
        `);

        $('#collapse4 .card-body').html(`
            <p><strong>Manager:</strong> ${button.data('testing-manager')}</p>
            <p><strong>Team Members:</strong> ${button.data('testing-team-members')}</p>
        `);

        $('#collapse5 .card-body').html(`
            <p><strong>Manager:</strong> ${button.data('ba-manager')}</p>
            <p><strong>Team Members:</strong> ${button.data('ba-team-members')}</p>
        `);
    });
});