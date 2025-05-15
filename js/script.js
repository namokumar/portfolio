// Hamburger menu functionality
window.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;
    // Get the icon inside the button
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
            // Toggle icon between bars and times
            if (menuIcon) {
                if (body.classList.contains('menu-open')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }
    // Optional: Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
                // Reset icon to bars
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    });
});
