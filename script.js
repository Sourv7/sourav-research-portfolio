/* ---------- Dynamic copyright year ---------- */

const currentYearElement = document.querySelector("#current-year");

if (currentYearElement) {
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = currentYear;
}

/* ---------- Mobile navigation ---------- */

const navToggle = document.querySelector(".nav-toggle");
const primaryMenu = document.querySelector("#primary-menu");

function closeNavigationMenu() {
    if (!navToggle || !primaryMenu) {
        return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    primaryMenu.classList.remove("is-open");
}

if (navToggle && primaryMenu) {
    const navigationLinks = primaryMenu.querySelectorAll("a");

    navToggle.addEventListener("click", function () {
        const menuIsOpen =
            navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute(
            "aria-expanded",
            String(!menuIsOpen)
        );

        navToggle.setAttribute(
            "aria-label",
            menuIsOpen
                ? "Open navigation menu"
                : "Close navigation menu"
        );

        primaryMenu.classList.toggle(
            "is-open",
            !menuIsOpen
        );
    });

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeNavigationMenu();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeNavigationMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 720) {
            closeNavigationMenu();
        }
    });
}

/* ---------- Project filtering ---------- */

const filterButtons =
    document.querySelectorAll(".filter-button");

const projectCards =
    document.querySelectorAll(
        "#projects article[data-category]"
    );

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            const buttonIsActive =
                filterButton === button;

            filterButton.classList.toggle(
                "is-active",
                buttonIsActive
            );

            filterButton.setAttribute(
                "aria-pressed",
                String(buttonIsActive)
            );
        });

        projectCards.forEach(function (projectCard) {
            const projectCategory =
                projectCard.dataset.category;

            const projectShouldBeVisible =
                selectedFilter === "all" ||
                projectCategory === selectedFilter;

            projectCard.hidden =
                !projectShouldBeVisible;
        });
    });
});