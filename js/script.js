// Menu burger
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});
// Carrousel
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let current = 0;

function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}

document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('next').addEventListener('click', () => goTo(current + 1));

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
});

// Défilement automatique toutes les 4 secondes
setInterval(() => goTo(current + 1), 4000);
// Validation formulaire
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const formMessage = document.getElementById('form-message');

        if (nom === '' || email === '' || message === '') {
            formMessage.style.color = 'red';
            formMessage.textContent = 'Veuillez remplir tous les champs obligatoires.';
        } else {
            formMessage.style.color = 'green';
            formMessage.textContent = 'Message envoyé avec succès ! Nous vous répondrons bientôt.';
            form.reset();
        }
    });
}