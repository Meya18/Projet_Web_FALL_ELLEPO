document.addEventListener("DOMContentLoaded", () => {

    // --- POPUP ---
    const popupOverlay = document.getElementById("popup-overlay");
    const popupClose = document.getElementById("popup-close");
    const popupBtn = document.getElementById("popup-btn");

    function fermerPopup() {
        if (popupOverlay) popupOverlay.classList.add("hidden");
    }

    if (popupClose) popupClose.addEventListener("click", fermerPopup);
    if (popupBtn) popupBtn.addEventListener("click", fermerPopup);

    if (popupOverlay) {
        popupOverlay.addEventListener("click", (event) => {
            if (event.target === popupOverlay) fermerPopup();
        });
    }

    // --- COMPTEURS ANIMÉS ---
    const compteurs = document.querySelectorAll(".compteur-nombre");

    compteurs.forEach((compteur) => {
        const target = Number(compteur.getAttribute("data-target"));
        let valeur = 0;
        const vitesse = 30;
        const increment = Math.ceil(target / 100);

        const animation = setInterval(() => {
            valeur += increment;
            if (valeur >= target) {
                compteur.textContent = target;
                clearInterval(animation);
            } else {
                compteur.textContent = valeur;
            }
        }, vitesse);
    });

    // --- QUIZ ---
    const questions = [
        {
            question: "En quelle année a été fondée l'EFREI ?",
            options: ["1920", "1936", "1950", "1968"],
            correct: 1
        },
        {
            question: "Combien de majeures propose le cycle ingénieur de l'EFREI ?",
            options: ["8", "10", "13", "16"],
            correct: 3
        },
        {
            question: "Quelle est la ville principale du campus EFREI ?",
            options: ["Paris", "Lyon", "Villejuif", "Bordeaux"],
            correct: 2
        },
        {
            question: "Combien d'années dure le cycle ingénieur à l'EFREI ?",
            options: ["2 ans", "3 ans", "4 ans", "5 ans"],
            correct: 1
        },
        {
            question: "Quel label garantit la qualité du diplôme d'ingénieur EFREI ?",
            options: ["ISO", "CTI", "W3C", "UNESCO"],
            correct: 1
        }
    ];

    let questionActuelle = 0;
    let score = 0;

    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.getElementById("quiz-options");
    const quizQuestionNum = document.getElementById("quiz-question-num");
    const quizProgressBar = document.getElementById("quiz-progress-bar");
    const quizResult = document.getElementById("quiz-result");
    const quizQuestionBox = document.getElementById("quiz-question-box");
    const quizRestart = document.getElementById("quiz-restart");
    const resultIcon = document.getElementById("result-icon");
    const resultTitre = document.getElementById("result-titre");
    const resultScore = document.getElementById("result-score");
    const resultMessage = document.getElementById("result-message");

    function afficherQuestion() {
        if (!quizQuestion) return;

        const q = questions[questionActuelle];
        quizQuestion.textContent = q.question;
        quizQuestionNum.textContent = `Question ${questionActuelle + 1} / ${questions.length}`;
        quizProgressBar.style.width = `${((questionActuelle + 1) / questions.length) * 100}%`;

        quizOptions.innerHTML = "";
        q.options.forEach((option, i) => {
            const btn = document.createElement("button");
            btn.classList.add("quiz-option");
            btn.textContent = option;
            btn.addEventListener("click", () => choisirReponse(i, btn));
            quizOptions.appendChild(btn);
        });
    }

    function choisirReponse(index, btn) {
        const q = questions[questionActuelle];
        const tousLesBoutons = quizOptions.querySelectorAll(".quiz-option");

        tousLesBoutons.forEach(b => b.disabled = true);

        if (index === q.correct) {
            btn.classList.add("correct");
            score++;
        } else {
            btn.classList.add("wrong");
            tousLesBoutons[q.correct].classList.add("correct");
        }

        setTimeout(() => {
            questionActuelle++;
            if (questionActuelle < questions.length) {
                afficherQuestion();
            } else {
                afficherResultat();
            }
        }, 1000);
    }

    function afficherResultat() {
        quizQuestionBox.style.display = "none";
        quizQuestionNum.style.display = "none";
        quizResult.style.display = "block";

        resultScore.textContent = `${score} / ${questions.length}`;

        if (score === questions.length) {
            resultIcon.textContent = "🏆";
            resultTitre.textContent = "Parfait !";
            resultMessage.textContent = "Tu connais l'EFREI sur le bout des doigts !";
        } else if (score >= 3) {
            resultIcon.textContent = "👍";
            resultTitre.textContent = "Bien joué !";
            resultMessage.textContent = "Tu t'y connais plutôt bien !";
        } else {
            resultIcon.textContent = "📚";
            resultTitre.textContent = "À revoir !";
            resultMessage.textContent = "Explore le site pour en apprendre plus sur l'EFREI !";
        }
    }

    if (quizRestart) {
        quizRestart.addEventListener("click", () => {
            questionActuelle = 0;
            score = 0;
            quizQuestionBox.style.display = "block";
            quizQuestionNum.style.display = "block";
            quizResult.style.display = "none";
            afficherQuestion();
        });
    }

    afficherQuestion();

});