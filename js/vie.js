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
