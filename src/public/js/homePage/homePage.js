$(document).ready(function () {
    // Toggle sidebar on navbar toggler click
    $('.navbar-toggler').click(function () {
        $('#sidebar').toggleClass('show');
        $('#main-screen-container').toggleClass('open');

        // Trigger a resize event to adjust the card container position
        $(window).trigger('resize');
    });

    // Close sidebar when clicking outside of it
    $(document).click(function (e) {
        if (!$(e.target).closest('#sidebar').length && !$(e.target).closest('.navbar-toggler').length) {
            if ($('#sidebar').hasClass('show')) {
                $('#sidebar').removeClass('show');
                $('#main-screen-container').removeClass('open');

                // Trigger a resize event to adjust the card container position
                $(window).trigger('resize');
            }
        }
    });

    // Listen for window resize events to adjust card container position
    $(window).resize(function () {
        // Check if sidebar is open
        if ($('#sidebar').hasClass('show')) {
            // Adjust padding of card container to shift cards right
            $('#card-container').css('padding-left', '270px'); // Width of the sidebar plus some padding
        } else {
            // Sidebar is closed, reset padding of card container
            $('#card-container').css('padding-left', '0');
        }
    });

    // Show logout modal on logout button click
    $('#logoutButton').click(function (e) {
        e.preventDefault();
        $('#logoutModal').modal('show');
    });

    // Handle logout confirmation
    $('#confirmLogout').click(function () {
        clearSessionAndCookies();
    });
});

function clearSessionAndCookies() {
    // Clear session storage
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach(function (cookie) {
        var cookieParts = cookie.split("=");
        var cookieName = cookieParts[0].trim();
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });

    window.location.href = '/'; // Redirect to login page after logout

    // Prevent back navigation to restricted pages after logout
    history.pushState(null, null, window.location.pathname);
    window.onpopstate = function () {
        history.go(0);
    };
}

function handleReportsClick() {
    window.location.href = '/reports/reports-home';
}

function handlePageCountDashboardClick() {
    window.location.href = '/page-count-dashboard/home';
}