// ================================
// MENU BURGER
// ================================
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-menu');

if (toggle && menu) {
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// ================================
// CARROUSEL
// ================================
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

// ================================
// FORMULAIRE CONTACT
// ================================
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

// ================================
// CHATBOT
// ================================
const flows = {
    start: {
        bot: "Bonjour ! 👋 Je suis <b>Lib</b>, votre assistant du département Informatique de l'EFREI.<br>Comment puis-je vous aider ?",
        options: [
            { label: "En savoir plus sur les formations", next: "formations" },
            { label: "Découvrir l'équipe enseignante",   next: "equipe" },
            { label: "Vie du département",                next: "vie" },
            { label: "Nous contacter",                    next: "contact" }
        ]
    },
    formations: {
        bot: "Nous proposons 4 filières principales en cycle ingénieur :<br><br>💻 Information Technology<br>🔒 Sécurité et Réseaux<br>📊 Data Science<br>🤖 Systèmes Embarqués",
        options: [
            { label: " Voir la page Formations", next: "goto:formations" },
            { label: "Retour au menu",          next: "start" }
        ]
    },
    equipe: {
        bot: "Notre département compte des enseignants experts dans leurs domaines : algorithmique, cybersécurité, data science, développement web et systèmes embarqués.",
        options: [
            { label: "Voir l'équipe enseignante", next: "goto:equipe" },
            { label: "Retour au menu",            next: "start" }
        ]
    },
    vie: {
        bot: "Découvrez les événements, le hackathon annuel, les conférences et la galerie photos du département !",
        options: [
            { label: "Voir la vie du département", next: "goto:vie" },
            { label: "Retour au menu",             next: "start" }
        ]
    },
    contact: {
        bot: "Vous pouvez nous contacter par :<br><br>📍 30-32 Avenue de la République, Villejuif<br>📞 +33 (0)1 46 77 46 00<br>📧 info@efrei.fr",
        options: [
            { label: "Aller à la page Contact", next: "goto:contact" },
            { label: "Retour au menu",          next: "start" }
        ]
    }
};

let chatOpen = false;
let started = false;

function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('chatbot-window').classList.toggle('hidden', !chatOpen);
    document.getElementById('intro-bubble').style.display = chatOpen ? 'none' : 'block';
    document.getElementById('notif-badge').classList.add('hidden');

    if (chatOpen && !started) {
        started = true;
        setTimeout(() => botStep('start'), 400);
    }
}

function owlAvatar() {
    return `<div class="msg-avatar">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect x="12" y="12" width="40" height="40" rx="20" fill="#4a90d9"/>
            <rect x="16" y="10" width="8" height="8" fill="#3a7bc8"/>
            <rect x="40" y="10" width="8" height="8" fill="#3a7bc8"/>
            <rect x="18" y="26" width="12" height="12" rx="2" fill="#1a1a2e"/>
            <rect x="34" y="26" width="12" height="12" rx="2" fill="#1a1a2e"/>
            <rect x="20" y="28" width="6" height="6" fill="#ffffff"/>
            <rect x="36" y="28" width="6" height="6" fill="#ffffff"/>
            <rect x="28" y="38" width="8" height="6" fill="#f5a623"/>
        </svg>
    </div>`;
}

function addBotMsg(html) {
    const msgs = document.getElementById('chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'msg bot';
    typingEl.innerHTML = owlAvatar() + `<div class="typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(typingEl);
    msgs.scrollTop = msgs.scrollHeight;

    return new Promise(resolve => {
        setTimeout(() => {
            typingEl.remove();
            const el = document.createElement('div');
            el.className = 'msg bot';
            el.innerHTML = owlAvatar() + `<div class="msg-bubble">${html}</div>`;
            msgs.appendChild(el);
            msgs.scrollTop = msgs.scrollHeight;
            resolve();
        }, 900);
    });
}

function addUserMsg(text) {
    const msgs = document.getElementById('chat-messages');
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = `<div class="msg-bubble">${text}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
}

function addOptions(options) {
    const msgs = document.getElementById('chat-messages');
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';

    const div = document.createElement('div');
    div.className = 'quick-options';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quick-btn';
        btn.textContent = opt.label;
        btn.onclick = () => {
            wrap.querySelectorAll('.quick-btn').forEach(b => b.disabled = true);
            addUserMsg(opt.label);
            setTimeout(() => botStep(opt.next), 200);
        };
        div.appendChild(btn);
    });

    wrap.innerHTML = owlAvatar();
    wrap.appendChild(div);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
}

async function botStep(key) {
    if (key.startsWith('goto:')) {
        const page = key.replace('goto:', '');
        const pages = {
            formations: 'formations.html',
            equipe: 'equipe.html',
            vie: 'vie.html',
            contact: 'contact.html'
        };
        await addBotMsg("Je vous redirige vers la page... ");
        setTimeout(() => {
            window.location.href = pages[page];
        }, 1000);
        return;
    }

    const flow = flows[key];
    if (!flow) return;

    await addBotMsg(flow.bot);

    if (flow.options && flow.options.length > 0) {
        await new Promise(r => setTimeout(r, 200));
        addOptions(flow.options);
    }
}

function sendUserMsg() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addUserMsg(text);

    setTimeout(async () => {
        const lower = text.toLowerCase();
        if (lower.includes('formation') || lower.includes('filière') || lower.includes('cours')) {
            botStep('formations');
        } else if (lower.includes('equipe') || lower.includes('prof') || lower.includes('enseignant')) {
            botStep('equipe');
        } else if (lower.includes('vie') || lower.includes('event') || lower.includes('hackathon')) {
            botStep('vie');
        } else if (lower.includes('contact') || lower.includes('email') || lower.includes('téléphone')) {
            botStep('contact');
        } else if (lower.includes('merci') || lower.includes('super') || lower.includes('ok')) {
            await addBotMsg("Avec plaisir ! 🦉 Bonne journée !");
        } else {
            await addBotMsg("Je ne suis pas sûr de comprendre 🦉 Voici ce que je peux faire pour vous :");
            botStep('start');
        }
    }, 300);
}

setTimeout(() => {
    const b = document.getElementById('intro-bubble');
    if (b) b.style.opacity = '0';
    setTimeout(() => { if (b) b.style.display = 'none'; }, 500);
}, 5000);

// ================================
// POPUP FILIÈRES
// ================================
const filieres = {
    it: {
        titre: "Information Technology",
        description: "La majeure IT forme des ingénieurs capables de concevoir et déployer des systèmes d'information complexes.",
        debouches: ["Développeur Full-Stack", "Chef de projet IT", "Architecte logiciel", "Consultant en transformation digitale"]
    },
    reseau: {
        titre: "Sécurité et Réseaux",
        description: "Cette majeure forme des experts en cybersécurité et en infrastructure réseaux pour protéger les systèmes informatiques.",
        debouches: ["Ingénieur cybersécurité", "Administrateur réseaux", "Consultant en sécurité", "Analyste SOC"]
    },
    data: {
        titre: "Data Science",
        description: "La majeure Data Science forme des spécialistes capables d'analyser et d'exploiter de grandes quantités de données.",
        debouches: ["Data Scientist", "Data Engineer", "Machine Learning Engineer", "Business Analyst"]
    },
    embarque: {
        titre: "Systèmes Embarqués",
        description: "Cette majeure forme des ingénieurs spécialisés dans la conception de systèmes embarqués et la robotique.",
        debouches: ["Ingénieur embarqué", "Développeur IoT", "Ingénieur robotique", "Ingénieur R&D"]
    }
};

const filiereOverlay = document.getElementById('filiere-overlay');
const filiereClose = document.getElementById('filiere-close');
const filiereContenu = document.getElementById('filiere-contenu');

document.querySelectorAll('.btn-filiere').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filiere = btn.closest('.card').getAttribute('data-filiere');
        const data = filieres[filiere];

        filiereContenu.innerHTML = `
            <h3>${data.titre}</h3>
            <p>${data.description}</p>
            <ul>${data.debouches.map(d => `<li>${d}</li>`).join('')}</ul>
        `;

        filiereOverlay.classList.remove('filiere-hidden');
    });
});

if (filiereClose) {
    filiereClose.addEventListener('click', () => {
        filiereOverlay.classList.add('filiere-hidden');
    });
}

if (filiereOverlay) {
    filiereOverlay.addEventListener('click', (e) => {
        if (e.target === filiereOverlay) {
            filiereOverlay.classList.add('filiere-hidden');
        }
    });
}