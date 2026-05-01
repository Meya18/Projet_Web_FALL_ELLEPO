document.addEventListener("DOMContentLoaded", () => {
    const popupOverlay = document.getElementById("popup-overlay");
    const popupClose = document.getElementById("popup-close");
    const popupBtn = document.getElementById("popup-btn");

    function fermerPopup() {
        popupOverlay.classList.add("hidden");
    }

    popupClose.addEventListener("click", fermerPopup);
    popupBtn.addEventListener("click", fermerPopup);

    popupOverlay.addEventListener("click", (event) => {
        if (event.target === popupOverlay) {
            fermerPopup();
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
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

    const popupOverlay = document.getElementById("popup-overlay");
    const popupClose = document.getElementById("popup-close");
    const popupBtn = document.getElementById("popup-btn");

    function fermerPopup() {
        popupOverlay.style.display = "none";
    }

    if (popupClose) {
        popupClose.addEventListener("click", fermerPopup);
    }

    if (popupBtn) {
        popupBtn.addEventListener("click", fermerPopup);
    }
});
