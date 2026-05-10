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

// ===== DONNÉES : contacts selon thème =====
const contacts = {
  technique: {
    name: "Léa Fall",
    role: "Responsable technique",
    email: "lea.fall@projet-fall.fr",
    desc: "Pour tous les problèmes techniques, bugs, ou questions sur le fonctionnement du site."
  },
  design: {
    name: "Ellep Martin",
    role: "Designer & UX",
    email: "ellep.martin@projet-fall.fr",
    desc: "Pour les retours sur le design, l'interface, ou les problèmes d'affichage."
  },
  contenu: {
    name: "Nina Rousseau",
    role: "Chargée de contenu",
    email: "n.rousseau@projet-fall.fr",
    desc: "Pour les questions sur les articles, publications, ou demandes d'information."
  },
  autre: {
    name: "Contact général",
    role: "Équipe FALL ELLEPO",
    email: "contact@projet-fall.fr",
    desc: "Pour toute autre demande, notre équipe vous répondra dans les meilleurs délais."
  }
};

// ===== FLUX DE CONVERSATION =====
const flows = {
  start: {
    bot: "Bonjour ! 👋 Je suis <b>Lib</b>, votre assistant.<br>Je vais vous aider à trouver la bonne personne à contacter. C'est à quel sujet ?",
    options: [
      { label: "🔧 Problème technique / bug", next: "technique" },
      { label: "🎨 Design ou affichage",       next: "design" },
      { label: "📝 Contenu ou information",    next: "contenu" },
      { label: "❓ Autre demande",             next: "autre" }
    ]
  },
  technique: {
    bot: "Je comprends, c'est un problème technique. Le problème est :",
    options: [
      { label: "🐛 Un bug ou erreur sur le site",      next: "show:technique" },
      { label: "⚡ Performance ou lenteur",             next: "show:technique" },
      { label: "🔐 Problème de connexion / compte",    next: "show:technique" }
    ]
  },
  design: {
    bot: "D'accord, pour tout ce qui touche à l'interface et au design ! Voici votre contact :",
    options: [],
    show: "design"
  },
  contenu: {
    bot: "Pour les questions de contenu, voici votre contact :",
    options: [],
    show: "contenu"
  },
  autre: {
    bot: "Pas de souci ! Pour toute autre demande, voici comment nous joindre :",
    options: [],
    show: "autre"
  }
};

// ===== ÉTAT =====
let chatOpen = false;
let started  = false;

// ===== TOGGLE CHAT =====
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

// ===== AVATAR HIBOU =====
function owlAvatar() {
  return `<div class="msg-avatar">
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <rect x="12" y="12" width="40" height="40" rx="20" fill="#4a90d9"/>
      <rect x="16" y="10" width="8"  height="8"  fill="#3a7bc8"/>
      <rect x="40" y="10" width="8"  height="8"  fill="#3a7bc8"/>
      <rect x="18" y="26" width="12" height="12" rx="2" fill="#1a1a2e"/>
      <rect x="34" y="26" width="12" height="12" rx="2" fill="#1a1a2e"/>
      <rect x="20" y="28" width="6"  height="6"  fill="#ffffff"/>
      <rect x="36" y="28" width="6"  height="6"  fill="#ffffff"/>
      <rect x="28" y="38" width="8"  height="6"  fill="#f5a623"/>
    </svg>
  </div>`;
}

// ===== AJOUTER MESSAGE BOT (avec typing) =====
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

// ===== AJOUTER MESSAGE UTILISATEUR =====
function addUserMsg(text) {
  const msgs = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'msg user';
  el.innerHTML = `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

// ===== AJOUTER BOUTONS OPTIONS =====
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

// ===== FICHE CONTACT HTML =====
function contactCardHTML(key) {
  const c = contacts[key];
  return `<div class="contact-card">
    <div class="name">👤 ${c.name}</div>
    <div class="role">${c.role}</div>
    <div style="font-size:12px;color:#64748b;margin:4px 0 6px;">${c.desc}</div>
    <div class="email">✉️ <a href="mailto:${c.email}">${c.email}</a></div>
  </div>`;
}

// ===== LOGIQUE DE CONVERSATION =====
async function botStep(key) {
  if (key.startsWith('show:')) {
    const contactKey = key.replace('show:', '');
    await addBotMsg("Voici la personne idéale pour vous aider :" + contactCardHTML(contactKey));
    await new Promise(r => setTimeout(r, 500));
    await addBotMsg("Vous pouvez aussi lui écrire directement via le formulaire ci-dessous ! 📝<br><br>Est-ce que j'ai répondu à votre question ?");
    addOptions([
      { label: "✅ Oui, merci !",          next: "end_yes" },
      { label: "🔄 Non, revenir au menu",  next: "start" }
    ]);
    return;
  }

  if (key === 'end_yes') {
    await addBotMsg("Avec plaisir ! 🦉 N'hésitez pas à revenir si vous avez d'autres questions. Bonne journée !");
    return;
  }

  const flow = flows[key];
  if (!flow) return;

  await addBotMsg(flow.bot);

  if (flow.show) {
    await new Promise(r => setTimeout(r, 300));
    const msgs = document.getElementById('chat-messages');
    const cardEl = document.createElement('div');
    cardEl.className = 'msg bot';
    cardEl.innerHTML = owlAvatar() + `<div>${contactCardHTML(flow.show)}</div>`;
    msgs.appendChild(cardEl);
    msgs.scrollTop = msgs.scrollHeight;
    await new Promise(r => setTimeout(r, 600));
    await addBotMsg("N'hésitez pas à lui écrire ou à utiliser le formulaire. 😊");
    addOptions([
      { label: "🔄 Retour au menu",        next: "start" },
      { label: "✅ Merci, c'est parfait !", next: "end_yes" }
    ]);
    return;
  }

  if (flow.options && flow.options.length > 0) {
    await new Promise(r => setTimeout(r, 200));
    addOptions(flow.options);
  }
}

// ===== ENVOI MESSAGE TEXTE LIBRE =====
function sendUserMsg() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMsg(text);

  setTimeout(async () => {
    const lower = text.toLowerCase();
    if (lower.includes('bug') || lower.includes('technique') || lower.includes('error')) {
      await addBotMsg("Pour les problèmes techniques :" + contactCardHTML('technique'));
    } else if (lower.includes('design') || lower.includes('interface') || lower.includes('couleur')) {
      await addBotMsg("Pour les questions de design :" + contactCardHTML('design'));
    } else if (lower.includes('contenu') || lower.includes('article') || lower.includes('information')) {
      await addBotMsg("Pour les questions de contenu :" + contactCardHTML('contenu'));
    } else if (lower.includes('merci') || lower.includes('super') || lower.includes('ok')) {
      await addBotMsg("Avec plaisir ! 🦉 Bonne journée !");
    } else {
      await addBotMsg("Je suis encore en apprentissage 🦉 Pour vous orienter correctement, dites-moi :");
      addOptions([
        { label: "🔧 Problème technique", next: "show:technique" },
        { label: "🎨 Design",             next: "show:design" },
        { label: "📝 Contenu",            next: "show:contenu" },
        { label: "❓ Autre",              next: "show:autre" }
      ]);
    }
  }, 300);
}

// ===== MASQUER BULLE INTRO APRÈS 5s =====
setTimeout(() => {
  const b = document.getElementById('intro-bubble');
  if (b) b.style.opacity = '0';
  setTimeout(() => { if (b) b.style.display = 'none'; }, 500);
}, 5000);
