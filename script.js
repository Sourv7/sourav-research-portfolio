/**
 * Portfolio interactions
 * ---------------------------------------------------------------------------
 * Sections:
 *   1. Shared helpers
 *   2. Dynamic copyright year
 *   3. Mobile navigation
 *   4. Project filtering
 *   6. Research publications
 *   7. Scroll reveal
 *   8. Active navigation highlighting
 *   9. Card tilt (projects and publications)
 *   10. Molecular network canvas
 *
 * Every DOM lookup is guarded so a missing optional element cannot break the
 * rest of the script.
 */

(function () {
    "use strict";

    /* ====================================================================
       1. Shared helpers
       ==================================================================== */

    var motionQuery = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    var finePointerQuery = window.matchMedia
        ? window.matchMedia("(hover: hover) and (pointer: fine)")
        : null;

    function prefersReducedMotion() {
        return Boolean(motionQuery && motionQuery.matches);
    }

    function hasFinePointer() {
        return Boolean(finePointerQuery && finePointerQuery.matches);
    }

    function supportsIntersectionObserver() {
        return typeof window.IntersectionObserver === "function";
    }

    function onMotionPreferenceChange(handler) {
        if (!motionQuery) {
            return;
        }

        if (typeof motionQuery.addEventListener === "function") {
            motionQuery.addEventListener("change", handler);
        } else if (typeof motionQuery.addListener === "function") {
            motionQuery.addListener(handler);
        }
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function toArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }

    /**
     * Read "r, g, b" custom properties from the document root so colours are
     * declared once in CSS. Falls back to the supplied defaults.
     */
    function readAccentChannels(propertyNames, fallbackColors) {
        var rootStyles = window.getComputedStyle(document.documentElement);

        return propertyNames.map(function (propertyName, index) {
            var rawValue = rootStyles.getPropertyValue(propertyName).trim();

            var channels = rawValue.split(",").map(function (channel) {
                return parseInt(channel, 10);
            });

            var isValid =
                channels.length === 3 &&
                channels.every(function (channel) {
                    return Number.isFinite(channel);
                });

            return isValid ? channels : fallbackColors[index];
        });
    }

    /* ====================================================================
       2. Dynamic copyright year
       ==================================================================== */

    var currentYearElement = document.querySelector("#current-year");

    if (currentYearElement) {
        currentYearElement.textContent = String(new Date().getFullYear());
    }

    /* ====================================================================
       3. Mobile navigation
       ==================================================================== */

    var navToggle = document.querySelector(".nav-toggle");
    var primaryMenu = document.querySelector("#primary-menu");

    function menuIsOpen() {
        return Boolean(
            navToggle && navToggle.getAttribute("aria-expanded") === "true"
        );
    }

    function setMenuState(shouldOpen) {
        if (!navToggle || !primaryMenu) {
            return;
        }

        navToggle.setAttribute("aria-expanded", String(shouldOpen));
        navToggle.setAttribute(
            "aria-label",
            shouldOpen ? "Close navigation menu" : "Open navigation menu"
        );

        primaryMenu.classList.toggle("is-open", shouldOpen);
    }

    function closeNavigationMenu() {
        setMenuState(false);
    }

    if (navToggle && primaryMenu) {
        navToggle.addEventListener("click", function () {
            setMenuState(!menuIsOpen());
        });

        primaryMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeNavigationMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape" || !menuIsOpen()) {
                return;
            }

            closeNavigationMenu();
            navToggle.focus();
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 720 && menuIsOpen()) {
                closeNavigationMenu();
            }
        });
    }

    /* ====================================================================
       4. Project cards
       ====================================================================
       Cards are generated from window.PORTFOLIO_PROJECTS (project-data.js)
       so the homepage and the case-study pages share one source of truth.
       The array order is the display order, featured projects first.
       ==================================================================== */

    function renderProjectCards() {
        var grid = document.querySelector(".project-grid");
        var catalogue = window.PORTFOLIO_PROJECTS;

        if (!grid || !Array.isArray(catalogue) || !catalogue.length) {
            return;
        }

        var fragment = document.createDocumentFragment();

        catalogue.forEach(function (project) {
            var card = document.createElement("article");

            card.className = "project-card";
            card.dataset.category = project.filterCategory || "";

            var meta = document.createElement("div");
            meta.className = "project-card-meta";

            var category = (project.category || [])[0];
            if (category) {
                var tag = document.createElement("span");
                tag.className = "project-tag";
                tag.textContent = category;
                meta.appendChild(tag);
            }

            if (project.status) {
                var status = document.createElement("span");
                status.className = "project-status-badge";
                status.textContent = project.status;
                meta.appendChild(status);
            }

            card.appendChild(meta);

            var heading = document.createElement("h3");
            heading.textContent = project.shortTitle || project.title;
            card.appendChild(heading);

            var summary = document.createElement("p");
            summary.textContent = project.summary || "";
            card.appendChild(summary);

            var technologies = (project.technologies || []).slice(0, 4);
            if (technologies.length) {
                var techList = document.createElement("ul");
                techList.className = "project-tech";
                techList.setAttribute("aria-label", "Key technologies");

                technologies.forEach(function (name) {
                    var item = document.createElement("li");
                    item.textContent = name;
                    techList.appendChild(item);
                });

                card.appendChild(techList);
            }

            var actions = document.createElement("div");
            actions.className = "project-card-actions";

            // The card itself is not a link, so there are no nested links and
            // no ambiguous click target.
            var caseLink = document.createElement("a");
            caseLink.className = "project-case-link";
            caseLink.href = "project.html?id=" + encodeURIComponent(project.id);
            caseLink.appendChild(document.createTextNode("View case study"));

            var context = document.createElement("span");
            context.className = "visually-hidden";
            context.textContent = " for " + (project.shortTitle || project.title);
            caseLink.appendChild(context);

            var caseArrow = document.createElement("span");
            caseArrow.className = "project-arrow";
            caseArrow.setAttribute("aria-hidden", "true");
            caseArrow.textContent = "\u2192";
            caseLink.appendChild(caseArrow);

            actions.appendChild(caseLink);

            // Only rendered when a URL actually exists.
            var external = project.githubUrl
                ? { href: project.githubUrl, label: "GitHub repository" }
                : project.publicationUrl
                    ? { href: project.publicationUrl, label: "Publication" }
                    : null;

            if (external) {
                var outbound = document.createElement("a");
                outbound.className = "project-external-link";
                outbound.href = external.href;
                outbound.target = "_blank";
                outbound.rel = "noopener noreferrer";
                outbound.appendChild(document.createTextNode(external.label));

                var outboundContext = document.createElement("span");
                outboundContext.className = "visually-hidden";
                outboundContext.textContent =
                    " for " + (project.shortTitle || project.title) +
                    " (opens in a new tab)";
                outbound.appendChild(outboundContext);

                var outboundArrow = document.createElement("span");
                outboundArrow.className = "project-arrow";
                outboundArrow.setAttribute("aria-hidden", "true");
                outboundArrow.textContent = "\u2197";
                outbound.appendChild(outboundArrow);

                actions.appendChild(outbound);
            }

            card.appendChild(actions);
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }

    renderProjectCards();

    /* ====================================================================
       5. Project filtering
       ====================================================================
       Both the projects and the publications section use the .filter-button
       class for styling, so each query is scoped to its own section.
       ==================================================================== */

    var filterButtons = toArray(
        document.querySelectorAll("#projects .filter-button")
    );

    var projectCards = toArray(
        document.querySelectorAll("#projects .project-card[data-category]")
    );

    var projectStatus = document.querySelector("#project-status");
    var pendingFilterFrame = null;

    function describeFilterResult(visibleCount, filterLabel, isAll) {
        if (visibleCount === 0) {
            return "No projects match this filter.";
        }

        if (isAll) {
            return "Showing all " + visibleCount + " projects.";
        }

        return (
            "Showing " +
            visibleCount +
            " of " +
            projectCards.length +
            " projects in " +
            filterLabel +
            "."
        );
    }

    function applyProjectFilter(activeButton) {
        var selectedFilter = activeButton.dataset.filter;
        var isAll = selectedFilter === "all";
        var visibleCards = [];

        filterButtons.forEach(function (button) {
            var buttonIsActive = button === activeButton;

            button.classList.toggle("is-active", buttonIsActive);
            button.setAttribute("aria-pressed", String(buttonIsActive));
        });

        projectCards.forEach(function (card) {
            var shouldBeVisible =
                isAll || card.dataset.category === selectedFilter;

            card.hidden = !shouldBeVisible;
            card.classList.remove("is-entering");

            if (shouldBeVisible) {
                // A card hidden during the initial reveal pass never
                // intersects, so make sure it is not left transparent.
                card.classList.add("is-visible");
                visibleCards.push(card);
            }
        });

        if (projectStatus) {
            projectStatus.textContent = describeFilterResult(
                visibleCards.length,
                activeButton.textContent.trim(),
                isAll
            );
        }

        // Cancel any queued animation frame so rapid filter clicks cannot
        // leave stale entrance classes behind.
        if (pendingFilterFrame !== null) {
            window.cancelAnimationFrame(pendingFilterFrame);
            pendingFilterFrame = null;
        }

        if (prefersReducedMotion()) {
            return;
        }

        pendingFilterFrame = window.requestAnimationFrame(function () {
            pendingFilterFrame = null;

            visibleCards.forEach(function (card) {
                card.classList.add("is-entering");
            });
        });
    }

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                applyProjectFilter(button);
            });
        });

        projectCards.forEach(function (card) {
            card.addEventListener("animationend", function () {
                card.classList.remove("is-entering");
            });
        });
    }

    /* ====================================================================
       6. Research publications
       ====================================================================
       The record of publications lives in the array below. Cards are built
       from it at run time, so adding an entry is the only edit needed to
       add a publication to the page.
       ==================================================================== */

    var publications = [
        {
            id: "l-asparaginase-mutagenesis-2026",
            title:
                "Directed Mutagenesis of Catalytic Residues in " +
                "L-Asparaginase II from Salmonella paratyphi: Structural, " +
                "Functional and Stability Analysis Using In-Vitro, Docking " +
                "and Simulation Studies",
            authors:
                "Ejlal Mohamed Abdullah, Mohd Shahnawaz Khan, " +
                "Farid Shokry Ataya, Majed S. Alokail, Chandra Sourav, " +
                "Pokhrel Ankit, Alaa Alnoor Alameen, Jeevan Kandel, " +
                "Bigyan Ranjan Jali",
            source: "Applied Biochemistry and Biotechnology",
            date: "21 July 2026",
            year: 2026,
            type: "journal",
            label: "Journal Article",
            doi: "10.1007/s12010-026-05838-z",
            url: "https://link.springer.com/article/10.1007/s12010-026-05838-z"
        },
        {
            id: "fadv11-vaccine-2026",
            title:
                "Multi-Epitope Vaccine Design Against Fowl Adenovirus " +
                "Serotype 11 Based on Conserved Penton and Fiber Proteins " +
                "for the Prevention of Inclusion Body Hepatitis in Poultry",
            authors:
                "Muhammad Daniyal Hameed, Abdul Raffay Qureshi, " +
                "Rumesa Ghazanfar, Muhammad Atiq Ur Rehman, Chandra Sourav, " +
                "Zainab Nagari, Muhammad Zeeshan Shabbir",
            source: "Preprints.org",
            date: "17 July 2026",
            year: 2026,
            type: "preprint",
            label: "Preprint — Not Peer Reviewed",
            doi: "10.20944/preprints202607.1274.v1",
            url: "https://www.preprints.org/manuscript/202607.1274"
        },
        {
            id: "influenza-vaccine-2026",
            title:
                "Immunoinformatics-Guided Design and In Silico Evaluation " +
                "of a Multi-Epitope Vaccine Against Influenza A H10N5 and " +
                "H3N2 Strains Based on Hemagglutinin and Neuraminidase " +
                "Proteins",
            authors:
                "Muhammad Zeeshan Shabbir, Prem Kumar, " +
                "Muhammad Atiq Ur Rehman, Jeevan Kumar, Umama Urooj, " +
                "Syeda Izza Batool, Chandra Sourav, Rumesa Ghazanfar, " +
                "Zainab Nagari, Daniyal Hameed, Abdul Wahid, Ayesha, " +
                "Muhammad Daniyal Siddique",
            source: "bioRxiv",
            date: "8 July 2026",
            year: 2026,
            type: "preprint",
            label: "Preprint — Not Peer Reviewed",
            doi: "10.64898/2026.07.03.736294",
            url:
                "https://www.biorxiv.org/content/" +
                "10.64898/2026.07.03.736294v1"
        },
        {
            id: "synechococcus-antimicrobial-2026",
            title:
                "Antimicrobial efficacy of cyanobacterium Synechococcus " +
                "pevalekii extracts against MDR bacteria and fungi; an " +
                "integrated GC–MS, molecular docking and MD simulation study",
            authors:
                "Sagar Patra, Sanjana Sabat, Ajit Kumar Bishoyi, " +
                "Chandra Sourav, Pokhrel Ankit, Mohd Shahnawaz Khan, " +
                "Bigyan Ranjan Jali, Rabindra Nath Padhy",
            source: "Antonie van Leeuwenhoek",
            date: "25 June 2026",
            year: 2026,
            type: "journal",
            label: "Journal Article",
            volume: "119",
            articleNumber: "149",
            doi: "10.1007/s10482-026-02362-2",
            url: "https://link.springer.com/article/10.1007/s10482-026-02362-2"
        },
        {
            id: "small-ruminant-vaccine-2026",
            title:
                "An in silico approach to design a multi-epitope vaccine " +
                "against small ruminant lentiviruses causing Maedi-Visna " +
                "and caprine arthritis encephalitis in sheep and goats",
            authors:
                "Rumesa Ghazanfar, Zainab Nagari, " +
                "Muhammad Atiq Ur Rehman, Chandra Sourav, " +
                "Muhammad Zeeshan Shabbir",
            source: "Microbes & Immunity",
            date: "9 June 2026",
            year: 2026,
            type: "journal",
            label: "Journal Article",
            articleNumber: "025450121",
            doi: "10.36922/MI025450121",
            url:
                "https://www.accscience.com/journal/MI/articles/" +
                "online_first/7970"
        },
        {
            id: "plectonema-bioactivity-2026",
            title:
                "Integrated bioactivity assessment of the cyanobacterium " +
                "plectonema terebrans extract: an in vitro and in silico " +
                "study",
            authors:
                "Sanjana Sabat, Sagar Patra, Chandra Sourav, " +
                "Pokhrel Ankit, Mohd Shahnawaz Khan, Bigyan Ranjan Jali, " +
                "Ajit Kumar Bishoyi, Rabindra Nath Padhy",
            source: "Antonie van Leeuwenhoek",
            date: "27 May 2026",
            year: 2026,
            type: "journal",
            label: "Journal Article",
            volume: "119",
            articleNumber: "135",
            doi: "10.1007/s10482-026-02350-6",
            url: "https://link.springer.com/article/10.1007/s10482-026-02350-6"
        },
        {
            id: "jak2-ai-discovery-2026",
            title:
                "AI and experimental convergence: a synergistic pathway to " +
                "JAK2 inhibitor discovery",
            authors:
                "Maryam Rasool, Hwangeui Cho, Ankit Pokhrel, " +
                "Sourav Chandra, Han-Jung Chae, Kil To Chong, Hilal Tayara",
            source: "Acta Pharmacologica Sinica",
            date: "27 January 2026",
            year: 2026,
            type: "journal",
            label: "Journal Article",
            volume: "47",
            pages: "1361–1373",
            doi: "10.1038/s41401-025-01701-9",
            url: "https://www.nature.com/articles/s41401-025-01701-9"
        },
        {
            id: "nigella-nsclc-2025",
            title:
                "Exploring Nigella sativa anticancerous properties using " +
                "network pharmacology, molecular docking and molecular " +
                "dynamics simulation approach for non-small cell lung cancer",
            authors: "Chandra Sourav, Kil To Chong, Hilal Tayara",
            source: "Food Bioscience",
            date: "January 2025",
            year: 2025,
            type: "journal",
            label: "Journal Article",
            volume: "63",
            articleNumber: "105525",
            doi: "10.1016/j.fbio.2024.105525",
            url:
                "https://www.sciencedirect.com/science/article/pii/" +
                "S2212429224019564"
        }
    ];

    var publicationGrid = document.querySelector("#publication-grid");
    var publicationStatus = document.querySelector("#publication-status");
    var publicationStatsList = document.querySelector(".publication-stats");

    var publicationFilterButtons = toArray(
        document.querySelectorAll("#publications .filter-button")
    );

    var publicationCards = [];
    var pendingPublicationFrame = null;

    // Both name orders used across the author lists.
    var SELF_NAME_PATTERN = /(Chandra Sourav|Sourav Chandra)/g;

    function appendAuthorList(target, authorsText) {
        // split() with a capturing group keeps the matched names, so the
        // author string is rebuilt as text nodes with no markup injected.
        authorsText.split(SELF_NAME_PATTERN).forEach(function (part) {
            if (!part) {
                return;
            }

            if (part === "Chandra Sourav" || part === "Sourav Chandra") {
                var self = document.createElement("strong");

                self.className = "publication-author-self";
                self.textContent = part;
                target.appendChild(self);

                return;
            }

            target.appendChild(document.createTextNode(part));
        });
    }

    function describePublicationDetail(entry) {
        var parts = [];

        if (entry.volume) {
            parts.push("Volume " + entry.volume);
        }

        if (entry.articleNumber) {
            parts.push("Article " + entry.articleNumber);
        }

        if (entry.pages) {
            parts.push("Pages " + entry.pages);
        }

        return parts.join(" · ");
    }

    function createPublicationCard(entry) {
        var card = document.createElement("article");

        card.className = "publication-card";
        card.id = "publication-" + entry.id;
        card.dataset.type = entry.type;
        card.dataset.year = String(entry.year);

        var header = document.createElement("div");
        header.className = "publication-header";

        var badge = document.createElement("span");
        badge.className =
            "publication-badge publication-badge-" + entry.type;
        badge.textContent = entry.label;
        header.appendChild(badge);

        var year = document.createElement("span");
        year.className = "publication-year";
        year.textContent = String(entry.year);
        header.appendChild(year);

        card.appendChild(header);

        var title = document.createElement("h3");
        title.className = "publication-title";
        title.textContent = entry.title;
        card.appendChild(title);

        var authors = document.createElement("p");
        authors.className = "publication-authors";
        appendAuthorList(authors, entry.authors);
        card.appendChild(authors);

        var source = document.createElement("p");
        source.className = "publication-source";

        var sourceName = document.createElement("cite");
        sourceName.textContent = entry.source;
        source.appendChild(sourceName);
        source.appendChild(document.createTextNode(" · " + entry.date));
        card.appendChild(source);

        var detailText = describePublicationDetail(entry);

        if (detailText) {
            var detail = document.createElement("p");

            detail.className = "publication-detail";
            detail.textContent = detailText;
            card.appendChild(detail);
        }

        var doi = document.createElement("p");
        doi.className = "publication-doi";
        doi.textContent = "DOI: " + entry.doi;
        card.appendChild(doi);

        var link = document.createElement("a");
        link.className = "publication-link";
        link.href = entry.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.appendChild(document.createTextNode("View publication"));

        var arrow = document.createElement("span");
        arrow.className = "publication-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "\u2192";
        link.appendChild(arrow);

        card.appendChild(link);

        return card;
    }

    function countPublications(predicate) {
        return publications.filter(predicate).length;
    }

    function animateStatValue(element, targetValue) {
        if (prefersReducedMotion()) {
            element.textContent = String(targetValue);
            return;
        }

        var DURATION = 750;
        var startTime = 0;

        element.textContent = "0";

        // A short, self-terminating count-up. It is not a persistent loop:
        // the last frame settles on the final value and stops.
        function tick(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            var progress = clamp((timestamp - startTime) / DURATION, 0, 1);
            var eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = String(Math.round(targetValue * eased));

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        }

        window.requestAnimationFrame(tick);
    }

    function setUpPublicationStats() {
        var statTargets = [
            {
                element: document.querySelector(
                    "[data-publication-stat='journal']"
                ),
                value: countPublications(function (entry) {
                    return entry.type === "journal";
                })
            },
            {
                element: document.querySelector(
                    "[data-publication-stat='preprint']"
                ),
                value: countPublications(function (entry) {
                    return entry.type === "preprint";
                })
            },
            {
                element: document.querySelector(
                    "[data-publication-stat='total']"
                ),
                value: publications.length
            }
        ].filter(function (target) {
            return Boolean(target.element);
        });

        if (!statTargets.length) {
            return;
        }

        function settle() {
            statTargets.forEach(function (target) {
                target.element.textContent = String(target.value);
            });
        }

        if (
            prefersReducedMotion() ||
            !supportsIntersectionObserver() ||
            !publicationStatsList
        ) {
            settle();
            return;
        }

        var statsObserver = new IntersectionObserver(
            function (entries) {
                if (!entries[0].isIntersecting) {
                    return;
                }

                statsObserver.disconnect();

                statTargets.forEach(function (target) {
                    animateStatValue(target.element, target.value);
                });
            },
            { threshold: 0.4 }
        );

        statsObserver.observe(publicationStatsList);
    }

    function publicationMatchesFilter(card, selectedFilter) {
        if (selectedFilter === "all") {
            return true;
        }

        if (selectedFilter === "journal" || selectedFilter === "preprint") {
            return card.dataset.type === selectedFilter;
        }

        return card.dataset.year === selectedFilter;
    }

    function describePublicationResult(visibleCount, filterLabel, isAll) {
        if (visibleCount === 0) {
            return "No publications match this filter.";
        }

        if (isAll) {
            return "Showing all " + visibleCount + " research outputs.";
        }

        return (
            "Showing " +
            visibleCount +
            " of " +
            publicationCards.length +
            " research outputs in " +
            filterLabel +
            "."
        );
    }

    function applyPublicationFilter(activeButton) {
        var selectedFilter = activeButton.dataset.publicationFilter;
        var isAll = selectedFilter === "all";
        var visibleCards = [];

        publicationFilterButtons.forEach(function (button) {
            var buttonIsActive = button === activeButton;

            button.classList.toggle("is-active", buttonIsActive);
            button.setAttribute("aria-pressed", String(buttonIsActive));
        });

        publicationCards.forEach(function (card) {
            var shouldBeVisible = publicationMatchesFilter(
                card,
                selectedFilter
            );

            card.hidden = !shouldBeVisible;
            card.classList.remove("is-entering");

            if (shouldBeVisible) {
                card.classList.add("is-visible");
                visibleCards.push(card);
            }
        });

        if (publicationStatus) {
            publicationStatus.textContent = describePublicationResult(
                visibleCards.length,
                activeButton.textContent.trim(),
                isAll
            );
        }

        if (pendingPublicationFrame !== null) {
            window.cancelAnimationFrame(pendingPublicationFrame);
            pendingPublicationFrame = null;
        }

        if (prefersReducedMotion()) {
            return;
        }

        pendingPublicationFrame = window.requestAnimationFrame(function () {
            pendingPublicationFrame = null;

            visibleCards.forEach(function (card) {
                card.classList.add("is-entering");
            });
        });
    }

    function renderPublications() {
        if (!publicationGrid) {
            return;
        }

        var fragment = document.createDocumentFragment();

        publications.forEach(function (entry) {
            var card = createPublicationCard(entry);

            card.addEventListener("animationend", function () {
                card.classList.remove("is-entering");
            });

            publicationCards.push(card);
            fragment.appendChild(card);
        });

        publicationGrid.appendChild(fragment);

        publicationFilterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                applyPublicationFilter(button);
            });
        });

        setUpPublicationStats();
    }

    renderPublications();

    /* ====================================================================
       7. Scroll reveal
       ==================================================================== */

    function setUpScrollReveal() {
        var revealTargets = toArray(
            document.querySelectorAll(
                "#about, #expertise h2, .expertise-list li, " +
                    "#projects h2, .project-filters, .project-card, " +
                    "#publications h2, .publications-intro, " +
                    ".publication-stats, .publication-filters, " +
                    ".publication-card, #contact, " +
                    // Case-study page sections; absent on the homepage.
                    ".case-section, .case-pager"
            )
        );

        if (!revealTargets.length) {
            return;
        }

        if (prefersReducedMotion() || !supportsIntersectionObserver()) {
            return;
        }

        revealTargets.forEach(function (target) {
            target.classList.add("reveal");
        });

        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.12
            }
        );

        revealTargets.forEach(function (target) {
            revealObserver.observe(target);
        });
    }

    setUpScrollReveal();

    /* ====================================================================
       8. Active navigation highlighting
       ==================================================================== */

    function setUpActiveNavigation() {
        var navLinks = toArray(
            document.querySelectorAll(".nav-link[href^='#']")
        );

        if (!navLinks.length || !supportsIntersectionObserver()) {
            return;
        }

        var linksBySection = {};
        var observedSections = [];

        navLinks.forEach(function (link) {
            var sectionId = link.getAttribute("href").slice(1);
            var section = sectionId ? document.getElementById(sectionId) : null;

            if (!section) {
                return;
            }

            linksBySection[sectionId] = link;
            observedSections.push(section);
        });

        if (!observedSections.length) {
            return;
        }

        var visibleSectionIds = [];

        function setActiveLink(sectionId) {
            navLinks.forEach(function (link) {
                var isActive = link === linksBySection[sectionId];

                link.classList.toggle("is-active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }

        var sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    var sectionId = entry.target.id;
                    var index = visibleSectionIds.indexOf(sectionId);

                    if (entry.isIntersecting && index === -1) {
                        visibleSectionIds.push(sectionId);
                    } else if (!entry.isIntersecting && index !== -1) {
                        visibleSectionIds.splice(index, 1);
                    }
                });

                if (!visibleSectionIds.length) {
                    return;
                }

                // Only one link may be active: pick the section that comes
                // first in document order among the visible ones.
                var topSectionId = observedSections
                    .map(function (section) {
                        return section.id;
                    })
                    .filter(function (id) {
                        return visibleSectionIds.indexOf(id) !== -1;
                    })[0];

                if (topSectionId) {
                    setActiveLink(topSectionId);
                }
            },
            {
                // Offset the sticky header so the highlight matches what the
                // reader actually sees below it.
                rootMargin: "-88px 0px -55% 0px",
                threshold: 0
            }
        );

        observedSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    setUpActiveNavigation();

    /* ====================================================================
       9. Card tilt (projects and publications)
       ====================================================================
       One shared implementation, given the full set of cards, so there is a
       single set of handlers and a single motion-preference listener.
       ==================================================================== */

    function setUpCardTilt(cards) {
        if (!cards.length) {
            return;
        }

        var MAXIMUM_TILT_DEGREES = 5;
        var activeCard = null;
        var activeRect = null;
        var pendingTiltFrame = null;
        var pointerClientX = 0;
        var pointerClientY = 0;

        function resetCard(card) {
            card.classList.remove("is-tilting");
            card.style.removeProperty("--tilt-x");
            card.style.removeProperty("--tilt-y");
            card.style.removeProperty("--glare-x");
            card.style.removeProperty("--glare-y");
        }

        function updateTilt() {
            pendingTiltFrame = null;

            if (!activeCard || !activeRect) {
                return;
            }

            var relativeX = (pointerClientX - activeRect.left) / activeRect.width;
            var relativeY = (pointerClientY - activeRect.top) / activeRect.height;

            relativeX = clamp(relativeX, 0, 1);
            relativeY = clamp(relativeY, 0, 1);

            var rotateY = (relativeX - 0.5) * 2 * MAXIMUM_TILT_DEGREES;
            var rotateX = (0.5 - relativeY) * 2 * MAXIMUM_TILT_DEGREES;

            activeCard.style.setProperty("--tilt-x", rotateX.toFixed(2) + "deg");
            activeCard.style.setProperty("--tilt-y", rotateY.toFixed(2) + "deg");
            activeCard.style.setProperty(
                "--glare-x",
                (relativeX * 100).toFixed(1) + "%"
            );
            activeCard.style.setProperty(
                "--glare-y",
                (relativeY * 100).toFixed(1) + "%"
            );
        }

        function handlePointerEnter(event) {
            if (event.pointerType === "touch" || !hasFinePointer()) {
                return;
            }

            if (prefersReducedMotion()) {
                return;
            }

            activeCard = event.currentTarget;
            // The rectangle is read once per hover instead of once per frame.
            activeRect = activeCard.getBoundingClientRect();
            activeCard.classList.add("is-tilting");
        }

        function handlePointerMove(event) {
            if (!activeCard || event.currentTarget !== activeCard) {
                return;
            }

            pointerClientX = event.clientX;
            pointerClientY = event.clientY;

            if (pendingTiltFrame === null) {
                pendingTiltFrame = window.requestAnimationFrame(updateTilt);
            }
        }

        function handlePointerLeave(event) {
            var card = event.currentTarget;

            if (pendingTiltFrame !== null) {
                window.cancelAnimationFrame(pendingTiltFrame);
                pendingTiltFrame = null;
            }

            if (activeCard === card) {
                activeCard = null;
                activeRect = null;
            }

            resetCard(card);
        }

        cards.forEach(function (card) {
            card.addEventListener("pointerenter", handlePointerEnter);
            card.addEventListener("pointermove", handlePointerMove);
            card.addEventListener("pointerleave", handlePointerLeave);
            card.addEventListener("pointercancel", handlePointerLeave);
        });

        onMotionPreferenceChange(function () {
            if (!prefersReducedMotion()) {
                return;
            }

            activeCard = null;
            activeRect = null;
            cards.forEach(resetCard);
        });
    }

    // Case-study metric tiles and pager cards are absent on the homepage;
    // including them here keeps a single tilt implementation and a single
    // motion-preference listener across both pages.
    var caseCards = toArray(
        document.querySelectorAll(".case-metric, .case-pager-link")
    );

    setUpCardTilt(projectCards.concat(publicationCards, caseCards));

    /* ====================================================================
       10. Molecular network canvas
       ====================================================================
       A rigid cloud of projected 3D nodes joined by bonds. Because the body
       is rigid, neighbour pairs are computed once at build time and only the
       rotation is recalculated per frame.
       ==================================================================== */

    function createMolecularNetwork(canvas) {
        var context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        // The palette lives in styles.css; read it so there is one source of
        // truth, and fall back to the same values if the tokens are missing.
        var NODE_COLORS = readAccentChannels(
            ["--primary-rgb", "--accent-cyan-rgb", "--accent-violet-rgb"],
            [
                [37, 99, 235],
                [6, 182, 212],
                [124, 58, 237]
            ]
        );

        var FOCAL_LENGTH = 3.1;
        var BOND_DISTANCE = 0.78;
        var MAXIMUM_BONDS_PER_NODE = 3;
        var IDLE_ROTATION_SPEED = 0.00011;

        var nodes = [];
        var bonds = [];
        var projectedX = null;
        var projectedY = null;
        var projectedScale = null;
        var projectedDepth = null;
        var drawOrder = null;
        var glowSprites = [];

        var cssWidth = 0;
        var cssHeight = 0;
        var centreX = 0;
        var centreY = 0;
        var projectionScale = 0;

        var rotationY = 0;
        var pointerTargetX = 0;
        var pointerTargetY = 0;
        var pointerCurrentX = 0;
        var pointerCurrentY = 0;

        var animationHandle = null;
        var lastTimestamp = 0;
        var isOnScreen = true;
        var builtForCount = -1;
        var isBackground = canvas.dataset.background === "true";

        /* ---------- Build ---------- */

        function chooseNodeCount(width) {
            if (width < 320) {
                return 26;
            }

            if (width < 480) {
                return 34;
            }

            return 54;
        }

        /* ---------- Structure generators ----------
           Each returns { nodes, bonds } in a unit-ish coordinate space. The
           projection, depth sort, lighting, and animation loop are shared, so
           adding a shape costs a generator and nothing else.

           A shape is chosen per page with data-shape on the canvas, which
           lets each case study show a structure that depicts its own subject
           rather than a generic sphere. */

        function node(x, y, z, radius, colorIndex) {
            return { x: x, y: y, z: z, radius: radius, colorIndex: colorIndex };
        }

        /** Fibonacci sphere. The homepage default: a general molecule. */
        function shapeMolecule(count) {
            var goldenAngle = Math.PI * (3 - Math.sqrt(5));
            var nodes = [];
            var index;

            for (index = 0; index < count; index += 1) {
                var y = 1 - (index / (count - 1)) * 2;
                var ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
                var theta = goldenAngle * index;
                var shell = index % 3 === 0 ? 0.58 : 1;

                nodes.push(node(
                    Math.cos(theta) * ringRadius * shell,
                    y * shell,
                    Math.sin(theta) * ringRadius * shell,
                    index % 5 === 0 ? 3.1 : 2.2,
                    index % NODE_COLORS.length
                ));
            }

            return { nodes: nodes, bonds: null };
        }

        /** Hubs with satellites: a compound-target interaction network. */
        function shapeNetwork(count) {
            var hubCount = 3;
            var nodes = [];
            var bonds = [];
            var index;

            for (index = 0; index < hubCount; index += 1) {
                var angle = (index / hubCount) * Math.PI * 2;

                nodes.push(node(
                    Math.cos(angle) * 0.42,
                    Math.sin(angle) * 0.30,
                    Math.sin(angle * 1.7) * 0.28,
                    4.4,
                    index % NODE_COLORS.length
                ));
            }

            for (index = hubCount; index < count; index += 1) {
                var hub = index % hubCount;
                var spread = 0.55 + ((index * 37) % 40) / 100;
                var a = index * 2.399;
                var b = index * 1.117;

                nodes.push(node(
                    nodes[hub].x + Math.cos(a) * Math.sin(b) * spread,
                    nodes[hub].y + Math.sin(a) * Math.sin(b) * spread,
                    nodes[hub].z + Math.cos(b) * spread,
                    2.0,
                    hub % NODE_COLORS.length
                ));

                bonds.push({ from: hub, to: index, strength: 0.85 });
            }

            for (index = 0; index < hubCount; index += 1) {
                bonds.push({
                    from: index,
                    to: (index + 1) % hubCount,
                    strength: 1
                });
            }

            return { nodes: nodes, bonds: bonds };
        }

        /** Two strands with rungs between them: an interacting pair. */
        function shapeDuplex(count) {
            var perStrand = Math.floor(count / 2);
            var nodes = [];
            var bonds = [];
            var index;

            for (index = 0; index < perStrand; index += 1) {
                var t = index / (perStrand - 1);
                var y = t * 2 - 1;
                var twist = t * Math.PI * 2.4;

                nodes.push(node(
                    Math.cos(twist) * 0.30 - 0.42, y,
                    Math.sin(twist) * 0.30, 2.4, 0
                ));
                nodes.push(node(
                    Math.cos(twist + Math.PI) * 0.30 + 0.42, y,
                    Math.sin(twist + Math.PI) * 0.30, 2.4, 1
                ));

                var a = index * 2;
                var b = index * 2 + 1;

                if (index > 0) {
                    bonds.push({ from: a - 2, to: a, strength: 1 });
                    bonds.push({ from: b - 2, to: b, strength: 1 });
                }

                // Cross-links: the attention between the two sequences.
                if (index % 2 === 0) {
                    bonds.push({ from: a, to: b, strength: 0.5 });
                }
            }

            return { nodes: nodes, bonds: bonds };
        }

        /** Parallel layers: several models under one protocol. */
        function shapeStack(count) {
            var layers = 4;
            var perLayer = Math.max(4, Math.floor(count / layers));
            var nodes = [];
            var bonds = [];
            var layer;
            var index;

            for (layer = 0; layer < layers; layer += 1) {
                var y = (layer / (layers - 1)) * 1.6 - 0.8;

                for (index = 0; index < perLayer; index += 1) {
                    var angle = (index / perLayer) * Math.PI * 2 + layer * 0.4;
                    var current = layer * perLayer + index;

                    nodes.push(node(
                        Math.cos(angle) * 0.72, y,
                        Math.sin(angle) * 0.72,
                        2.3, layer % NODE_COLORS.length
                    ));

                    if (index > 0) {
                        bonds.push({ from: current - 1, to: current, strength: 0.9 });
                    }

                    if (index === perLayer - 1) {
                        bonds.push({
                            from: current,
                            to: layer * perLayer,
                            strength: 0.9
                        });
                    }

                    if (layer > 0 && index % 2 === 0) {
                        bonds.push({
                            from: current - perLayer,
                            to: current,
                            strength: 0.45
                        });
                    }
                }
            }

            return { nodes: nodes, bonds: bonds };
        }

        /** An alpha helix with a few residues marked: a protein domain. */
        function shapeHelix(count) {
            var nodes = [];
            var bonds = [];
            var index;

            for (index = 0; index < count; index += 1) {
                var t = index / (count - 1);
                var angle = t * Math.PI * 7;
                var marked = index % 7 === 3;

                nodes.push(node(
                    Math.cos(angle) * 0.62,
                    t * 1.9 - 0.95,
                    Math.sin(angle) * 0.62,
                    marked ? 4.0 : 2.1,
                    marked ? 2 : 0
                ));

                if (index > 0) {
                    bonds.push({ from: index - 1, to: index, strength: 1 });
                }

                // Hydrogen-bond style turn-to-turn contacts.
                if (index > 4) {
                    bonds.push({ from: index - 4, to: index, strength: 0.35 });
                }
            }

            return { nodes: nodes, bonds: bonds };
        }

        /** Two separated clusters: a binary classification. */
        function shapeScatter(count) {
            var nodes = [];
            var index;

            for (index = 0; index < count; index += 1) {
                var malignant = index % 2 === 0;
                var a = index * 2.399;
                var b = index * 1.31;
                var spread = 0.30 + ((index * 53) % 30) / 100;

                nodes.push(node(
                    (malignant ? -0.46 : 0.46) + Math.cos(a) * Math.sin(b) * spread,
                    Math.sin(a) * Math.sin(b) * spread * 1.3,
                    Math.cos(b) * spread,
                    2.4,
                    malignant ? 0 : 1
                ));
            }

            // No explicit bonds: distance-based linking keeps each cluster
            // internally connected and leaves the gap between them visible.
            return { nodes: nodes, bonds: null };
        }

        var SHAPES = {
            molecule: shapeMolecule,
            network: shapeNetwork,
            duplex: shapeDuplex,
            stack: shapeStack,
            helix: shapeHelix,
            scatter: shapeScatter
        };

        function buildStructure(nodeCount) {
            var name = canvas.dataset.shape || "molecule";
            var generator = SHAPES[name] || SHAPES.molecule;

            return generator(nodeCount);
        }

        function buildBonds(nodeList) {
            var built = [];
            var connectionCounts = new Array(nodeList.length).fill(0);
            var first;
            var second;

            for (first = 0; first < nodeList.length; first += 1) {
                for (second = first + 1; second < nodeList.length; second += 1) {
                    if (connectionCounts[first] >= MAXIMUM_BONDS_PER_NODE) {
                        break;
                    }

                    if (connectionCounts[second] >= MAXIMUM_BONDS_PER_NODE) {
                        continue;
                    }

                    var deltaX = nodeList[first].x - nodeList[second].x;
                    var deltaY = nodeList[first].y - nodeList[second].y;
                    var deltaZ = nodeList[first].z - nodeList[second].z;

                    var distance = Math.sqrt(
                        deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ
                    );

                    if (distance > BOND_DISTANCE) {
                        continue;
                    }

                    built.push({
                        from: first,
                        to: second,
                        strength: 1 - distance / BOND_DISTANCE
                    });

                    connectionCounts[first] += 1;
                    connectionCounts[second] += 1;
                }
            }

            return built;
        }

        function createGlowSprite(color) {
            var size = 64;
            var sprite = document.createElement("canvas");

            sprite.width = size;
            sprite.height = size;

            var spriteContext = sprite.getContext("2d");

            if (!spriteContext) {
                return null;
            }

            var gradient = spriteContext.createRadialGradient(
                size / 2,
                size / 2,
                0,
                size / 2,
                size / 2,
                size / 2
            );

            var rgb = color[0] + ", " + color[1] + ", " + color[2];

            gradient.addColorStop(0, "rgba(" + rgb + ", 0.55)");
            gradient.addColorStop(0.35, "rgba(" + rgb + ", 0.20)");
            gradient.addColorStop(1, "rgba(" + rgb + ", 0)");

            spriteContext.fillStyle = gradient;
            spriteContext.fillRect(0, 0, size, size);

            return sprite;
        }

        function buildScene() {
            var nodeCount = chooseNodeCount(cssWidth || 320);

            if (builtForCount === nodeCount) {
                return;
            }

            builtForCount = nodeCount;

            var structure = buildStructure(nodeCount);

            nodes = structure.nodes;
            // A generator may define its own connectivity; otherwise fall back
            // to distance-based bonding.
            bonds = structure.bonds || buildBonds(nodes);
            nodeCount = nodes.length;

            // Typed arrays are allocated once, never inside the frame loop.
            projectedX = new Float32Array(nodeCount);
            projectedY = new Float32Array(nodeCount);
            projectedScale = new Float32Array(nodeCount);
            projectedDepth = new Float32Array(nodeCount);
            drawOrder = new Uint16Array(nodeCount);
        }

        /* ---------- Sizing ---------- */

        function resizeCanvas() {
            var bounds = canvas.getBoundingClientRect();

            if (!bounds.width || !bounds.height) {
                return false;
            }

            // A full-viewport background covers roughly five times the area
            // of the hero box, so it is capped lower. At the opacity this
            // layer runs at, the difference is not visible, and it keeps the
            // per-frame fill cost close to the original.
            var maximumRatio = isBackground ? 1.5 : 2;
            var devicePixelRatio = Math.min(
                window.devicePixelRatio || 1,
                maximumRatio
            );

            cssWidth = bounds.width;
            cssHeight = bounds.height;
            centreX = cssWidth / 2;
            centreY = cssHeight / 2;
            projectionScale =
                Math.min(cssWidth, cssHeight) * (isBackground ? 0.40 : 0.34);

            canvas.width = Math.round(cssWidth * devicePixelRatio);
            canvas.height = Math.round(cssHeight * devicePixelRatio);

            context.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0
            );

            buildScene();

            return true;
        }

        /* ---------- Drawing ---------- */

        function projectNodes() {
            var angleY = rotationY + pointerCurrentX;
            var angleX = pointerCurrentY;

            var cosY = Math.cos(angleY);
            var sinY = Math.sin(angleY);
            var cosX = Math.cos(angleX);
            var sinX = Math.sin(angleX);

            var index;

            for (index = 0; index < nodes.length; index += 1) {
                var node = nodes[index];

                var rotatedX = node.x * cosY + node.z * sinY;
                var rotatedZ = node.z * cosY - node.x * sinY;

                var rotatedY = node.y * cosX - rotatedZ * sinX;
                var depthZ = node.y * sinX + rotatedZ * cosX;

                var perspective = FOCAL_LENGTH / (FOCAL_LENGTH + depthZ);

                projectedX[index] = centreX + rotatedX * perspective * projectionScale;
                projectedY[index] = centreY + rotatedY * perspective * projectionScale;
                projectedScale[index] = perspective;
                projectedDepth[index] = depthZ;
                drawOrder[index] = index;
            }
        }

        function sortDrawOrderBackToFront() {
            // Insertion sort over a small, nearly sorted index array.
            var index;

            for (index = 1; index < drawOrder.length; index += 1) {
                var currentIndex = drawOrder[index];
                var currentDepth = projectedDepth[currentIndex];
                var scan = index - 1;

                while (scan >= 0 && projectedDepth[drawOrder[scan]] < currentDepth) {
                    drawOrder[scan + 1] = drawOrder[scan];
                    scan -= 1;
                }

                drawOrder[scan + 1] = currentIndex;
            }
        }

        function drawBonds() {
            var index;

            context.lineCap = "round";

            for (index = 0; index < bonds.length; index += 1) {
                var bond = bonds[index];
                var averageScale =
                    (projectedScale[bond.from] + projectedScale[bond.to]) / 2;

                var alpha = clamp(
                    (averageScale - 0.72) * 0.9 * bond.strength + 0.05,
                    0,
                    0.4
                );

                if (alpha <= 0.01) {
                    continue;
                }

                var bondColor = NODE_COLORS[nodes[bond.from].colorIndex] ||
                    NODE_COLORS[0];

                context.strokeStyle =
                    "rgba(" + bondColor[0] + ", " + bondColor[1] + ", " +
                    bondColor[2] + ", " + alpha.toFixed(3) + ")";
                context.lineWidth = Math.max(0.4, averageScale * 0.9);

                context.beginPath();
                context.moveTo(projectedX[bond.from], projectedY[bond.from]);
                context.lineTo(projectedX[bond.to], projectedY[bond.to]);
                context.stroke();
            }
        }

        function drawNodes() {
            var index;

            for (index = 0; index < drawOrder.length; index += 1) {
                var nodeIndex = drawOrder[index];
                var node = nodes[nodeIndex];
                var perspective = projectedScale[nodeIndex];

                var radius = node.radius * perspective;
                var alpha = clamp((perspective - 0.66) * 2.2, 0.16, 1);
                var sprite = glowSprites[node.colorIndex];

                if (sprite) {
                    var glowSize = radius * 9;

                    context.globalAlpha = alpha * 0.75;
                    context.drawImage(
                        sprite,
                        projectedX[nodeIndex] - glowSize / 2,
                        projectedY[nodeIndex] - glowSize / 2,
                        glowSize,
                        glowSize
                    );
                }

                var color = NODE_COLORS[node.colorIndex];

                context.globalAlpha = alpha;
                context.fillStyle =
                    "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";

                context.beginPath();
                context.arc(
                    projectedX[nodeIndex],
                    projectedY[nodeIndex],
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fill();
            }

            context.globalAlpha = 1;
        }

        function drawFrame() {
            context.clearRect(0, 0, cssWidth, cssHeight);

            projectNodes();
            sortDrawOrderBackToFront();
            drawBonds();
            drawNodes();
        }

        /* ---------- Animation loop ---------- */

        function step(timestamp) {
            animationHandle = null;

            var deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;

            lastTimestamp = timestamp;
            deltaTime = Math.min(deltaTime, 48);

            rotationY += IDLE_ROTATION_SPEED * deltaTime;

            // Ease towards the pointer target, and back to rest when the
            // pointer leaves.
            pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.045;
            pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.045;

            drawFrame();

            requestNextFrame();
        }

        function requestNextFrame() {
            if (animationHandle !== null) {
                return;
            }

            if (document.hidden || !isOnScreen || prefersReducedMotion()) {
                return;
            }

            animationHandle = window.requestAnimationFrame(step);
        }

        function stopAnimation() {
            if (animationHandle === null) {
                return;
            }

            window.cancelAnimationFrame(animationHandle);
            animationHandle = null;
        }

        function startAnimation() {
            lastTimestamp = 0;
            requestNextFrame();
        }

        function renderStaticFrame() {
            pointerCurrentX = 0;
            pointerCurrentY = 0;
            rotationY = 0.6;

            drawFrame();
        }

        /* ---------- Input and lifecycle ---------- */

        function handlePointerMove(event) {
            if (prefersReducedMotion() || !hasFinePointer()) {
                return;
            }

            var normalisedX = event.clientX / window.innerWidth - 0.5;
            var normalisedY = event.clientY / window.innerHeight - 0.5;

            pointerTargetX = clamp(normalisedX, -0.5, 0.5) * 0.6;
            pointerTargetY = clamp(normalisedY, -0.5, 0.5) * 0.4;
        }

        function handlePointerLeave() {
            pointerTargetX = 0;
            pointerTargetY = 0;
        }

        function applyMotionPreference() {
            if (prefersReducedMotion()) {
                stopAnimation();
                handlePointerLeave();
                renderStaticFrame();
                return;
            }

            startAnimation();
        }

        function initialise() {
            if (!resizeCanvas()) {
                // The element has no measurable box yet; try once more after
                // the browser has finished its first layout pass.
                window.requestAnimationFrame(function () {
                    if (resizeCanvas()) {
                        glowSprites = NODE_COLORS.map(createGlowSprite);
                        applyMotionPreference();
                    }
                });

                return;
            }

            glowSprites = NODE_COLORS.map(createGlowSprite);

            applyMotionPreference();
        }

        var resizeFrame = null;

        function handleResize() {
            if (resizeFrame !== null) {
                return;
            }

            resizeFrame = window.requestAnimationFrame(function () {
                resizeFrame = null;

                if (!resizeCanvas()) {
                    return;
                }

                if (prefersReducedMotion()) {
                    renderStaticFrame();
                }
            });
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("pointermove", handlePointerMove, {
            passive: true
        });
        document.addEventListener("pointerleave", handlePointerLeave);

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopAnimation();
                return;
            }

            if (!prefersReducedMotion()) {
                startAnimation();
            }
        });

        // A fixed background layer never leaves the viewport, so the
        // scroll-based pause below does not apply to it. Pausing on a hidden
        // tab still does, and that is the case that matters for battery.
        if (supportsIntersectionObserver() && !isBackground) {
            var visibilityObserver = new IntersectionObserver(
                function (entries) {
                    isOnScreen = entries[0].isIntersecting;

                    if (isOnScreen) {
                        if (!prefersReducedMotion()) {
                            startAnimation();
                        }
                    } else {
                        stopAnimation();
                    }
                },
                { threshold: 0 }
            );

            visibilityObserver.observe(canvas);
        }

        onMotionPreferenceChange(applyMotionPreference);

        initialise();
    }

    /* ====================================================================
       11. Contact form
       ====================================================================
       Progressive enhancement over a plain form: submitted with fetch, with
       validation messages announced through a polite live region. The
       recipient address lives only in the serverless function, so it is never
       exposed to scrapers.
       ==================================================================== */

    function setUpContactForm() {
        var form = document.querySelector("#contact-form");
        var status = document.querySelector("#contact-status");

        if (!form || !status) {
            return;
        }

        var submitButton = form.querySelector('button[type="submit"]');
        var isSending = false;

        function report(message, state) {
            status.textContent = message;
            status.dataset.state = state;
        }

        function firstProblem(values) {
            if (!values.name) {
                return { message: "Please add your name.", field: "#contact-name" };
            }

            if (!values.email) {
                return { message: "Please add your email address.", field: "#contact-email" };
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
                return {
                    message: "That email address does not look right.",
                    field: "#contact-email"
                };
            }

            if (values.message.length < 10) {
                return {
                    message: "Please write a little more so I can reply usefully.",
                    field: "#contact-message"
                };
            }

            return null;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (isSending) {
                return;
            }

            var values = {
                name: form.elements.name.value.trim(),
                email: form.elements.email.value.trim(),
                message: form.elements.message.value.trim(),
                website: form.elements.website.value.trim()
            };

            var problem = firstProblem(values);

            if (problem) {
                report(problem.message, "error");

                var field = document.querySelector(problem.field);
                if (field) {
                    field.focus();
                }

                return;
            }

            isSending = true;
            submitButton.disabled = true;
            report("Sending…", "pending");

            window.fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })
                .then(function (response) {
                    return response.json().then(function (payload) {
                        return { ok: response.ok, payload: payload };
                    });
                })
                .then(function (result) {
                    if (!result.ok) {
                        report(
                            result.payload.error ||
                                "The message could not be sent. Please try GitHub instead.",
                            "error"
                        );
                        return;
                    }

                    form.reset();
                    report("Thank you. Your message has been sent.", "success");
                })
                .catch(function () {
                    report(
                        "The message could not be sent. Please check your connection, or reach me through the profile links.",
                        "error"
                    );
                })
                .then(function () {
                    isSending = false;
                    submitButton.disabled = false;
                });
        });
    }

    setUpContactForm();

    var molecularCanvas = document.querySelector("#molecular-canvas");

    if (molecularCanvas) {
        createMolecularNetwork(molecularCanvas);
    }
})();
