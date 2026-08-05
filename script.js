const currentYearElement = document.querySelector("#current-year");

const currentYear = new Date().getFullYear();

currentYearElement.textContent = currentYear;

const navToggle = document.querySelector(".nav-toggle");
const primaryMenu = document.querySelector("#primary-menu");
const navigationLinks = primaryMenu.querySelectorAll("a");

navToggle.addEventListener("click", function () {
    const menuIsOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!menuIsOpen));
    navToggle.setAttribute(
        "aria-label",
        menuIsOpen ? "Open navigation menu" : "Close navigation menu"
    );

    primaryMenu.classList.toggle("is-open");
});

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
        primaryMenu.classList.remove("is-open");
    });
});