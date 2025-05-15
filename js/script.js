// Hamburger menu functionality
window.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const header = document.header;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('menu-open');
        });
    }
    // Optional: Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
            }
        });
    });
});
