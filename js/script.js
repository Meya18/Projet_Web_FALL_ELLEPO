// Menu burger
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

if (toggle && menu) {
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// Carrousel
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let current = 0;

if (slides.length > 0) {
    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    setInterval(() => goTo(current + 1), 4000);
}
// Formulaire contact
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formMessage = document.getElementById('form-message');
        formMessage.style.color = 'green';
        formMessage.textContent = 'Message envoyé avec succès !';
        form.reset();
    });
}