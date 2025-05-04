// Marquee infinite scroll
window.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        marquee.innerHTML += marquee.innerHTML; // duplicate for infinite effect
    }
});