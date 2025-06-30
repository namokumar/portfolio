// Hamburger menu functionality
window.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const body = document.body;
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }
    // Optional: Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
            }
        });
    });
});

// Infinite logo marquee functionality
document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.logo-marquee');
    if (marquee) {
        // Clone all items to create a seamless loop
        const originalItems = marquee.querySelectorAll('.logo-item');
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            marquee.appendChild(clone);
        });

        // To make it extra smooth, we can even add a second copy
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            marquee.appendChild(clone);
        });
    }
});