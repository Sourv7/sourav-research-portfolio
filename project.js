/**
 * Case-study page renderer
 * ---------------------------------------------------------------------------
 * Reads ?id= from the URL, finds the matching object in
 * window.PORTFOLIO_PROJECTS, and builds the case study.
 *
 * Navigation, the mobile menu, the copyright year, scroll reveal, and card
 * tilt all come from the site's existing script.js, which is loaded on this
 * page too. Every lookup in that file is guarded, so the parts that belong to
 * the homepage (hero canvas, publications, project filters) simply do not run
 * here. Nothing from it is duplicated below.
 *
 * All text is inserted with textContent or createTextNode. No data value is
 * ever concatenated into innerHTML.
 */

(function () {
    "use strict";

    var SITE_ORIGIN = "https://sourav-research-portfolio.vercel.app";
    var projects = window.PORTFOLIO_PROJECTS || [];

    var article = document.querySelector("#case-study");
    var notFound = document.querySelector("#project-not-found");

    if (!article || !notFound) {
        return;
    }

    /* ------------------------------------------------------------------
       Small DOM helpers
       ------------------------------------------------------------------ */

    function element(tag, className, text) {
        var node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined && text !== null && text !== "") {
            node.textContent = String(text);
        }

        return node;
    }

    function isFilledArray(value) {
        return Array.isArray(value) && value.length > 0;
    }

    /** A section with a heading, appended only when it has content. */
    function section(id, heading) {
        var wrapper = element("section", "case-section");
        wrapper.id = id;
        wrapper.appendChild(element("h2", null, heading));
        return wrapper;
    }

    function bulletList(items, className) {
        var list = element("ul", className || "case-list");

        items.forEach(function (item) {
            list.appendChild(element("li", null, item));
        });

        return list;
    }

    function chipList(items, className, label) {
        var list = element("ul", className);
        list.setAttribute("aria-label", label);

        items.forEach(function (item) {
            var entry = document.createElement("li");
            entry.appendChild(element("span", "case-chip", item));
            list.appendChild(entry);
        });

        return list;
    }

    /** External link with a visually hidden "opens in a new tab" note. */
    function externalLink(href, label, className) {
        var link = element("a", className);

        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.appendChild(document.createTextNode(label));
        link.appendChild(element("span", "visually-hidden", " (opens in a new tab)"));

        var arrow = element("span", "case-arrow", "\u2197");
        arrow.setAttribute("aria-hidden", "true");
        link.appendChild(arrow);

        return link;
    }

    function internalLink(href, label, className) {
        var link = element("a", className);

        link.href = href;
        link.appendChild(document.createTextNode(label));

        var arrow = element("span", "case-arrow", "\u2192");
        arrow.setAttribute("aria-hidden", "true");
        link.appendChild(arrow);

        return link;
    }

    /* ------------------------------------------------------------------
       Results: either plain strings or { heading, note, items }
       ------------------------------------------------------------------ */

    function metricRow(item) {
        var row = element("div", "case-metric");

        row.appendChild(element("dt", "case-metric-label", item.label));
        row.appendChild(element("dd", "case-metric-value", item.value));

        return row;
    }

    function resultGroup(group) {
        var wrapper = element("div", "case-result-group");

        if (group.heading) {
            wrapper.appendChild(element("h3", null, group.heading));
        }

        if (group.note) {
            wrapper.appendChild(element("p", "case-note", group.note));
        }

        var items = group.items || [];
        var metrics = items.filter(function (item) {
            return item && typeof item === "object";
        });
        var sentences = items.filter(function (item) {
            return typeof item === "string";
        });

        if (metrics.length) {
            var grid = element("dl", "case-metrics");
            metrics.forEach(function (item) {
                grid.appendChild(metricRow(item));
            });
            wrapper.appendChild(grid);
        }

        if (sentences.length) {
            wrapper.appendChild(bulletList(sentences));
        }

        return wrapper;
    }

    function renderResults(results) {
        var wrapper = section("results", "Results");
        var plain = results.filter(function (item) {
            return typeof item === "string";
        });
        var groups = results.filter(function (item) {
            return item && typeof item === "object";
        });

        if (plain.length) {
            wrapper.appendChild(bulletList(plain));
        }

        groups.forEach(function (group) {
            wrapper.appendChild(resultGroup(group));
        });

        return wrapper;
    }

    /* ------------------------------------------------------------------
       Workflow: an ordered list, styled as steps. Vertical on narrow
       screens, wrapped horizontally on wide ones, entirely through CSS.
       ------------------------------------------------------------------ */

    function renderWorkflow(steps) {
        var wrapper = section("workflow", "Workflow");
        var list = element("ol", "workflow-steps");

        steps.forEach(function (step, index) {
            var item = element("li", "workflow-step");
            var number = element("span", "workflow-step-number", index + 1);

            number.setAttribute("aria-hidden", "true");
            item.appendChild(number);
            item.appendChild(element("span", "workflow-step-label", step));
            list.appendChild(item);
        });

        wrapper.appendChild(list);
        return wrapper;
    }

    /* ------------------------------------------------------------------
       Header
       ------------------------------------------------------------------ */

    function renderHeader(project) {
        var header = element("header", "case-header");
        var meta = element("div", "case-header-meta");

        var status = element("span", "case-status", project.status);
        status.setAttribute("aria-label", "Project status: " + project.status);
        meta.appendChild(status);

        header.appendChild(meta);
        header.appendChild(element("h1", "case-title", project.title));
        header.appendChild(element("p", "case-summary", project.summary));

        if (project.role) {
            var role = element("p", "case-role");
            role.appendChild(element("span", "case-role-label", "My role: "));
            role.appendChild(document.createTextNode(project.role));
            header.appendChild(role);
        }

        if (isFilledArray(project.category)) {
            header.appendChild(
                chipList(project.category, "case-categories", "Project categories")
            );
        }

        var actions = element("div", "case-actions");
        var hasAction = false;

        if (project.publicationUrl) {
            actions.appendChild(
                externalLink(
                    project.publicationUrl,
                    "Read the publication",
                    "button button-primary"
                )
            );
            hasAction = true;
        }

        if (project.githubUrl) {
            actions.appendChild(
                externalLink(
                    project.githubUrl,
                    "View repository on GitHub",
                    "button " + (hasAction ? "button-secondary" : "button-primary")
                )
            );
            hasAction = true;
        }

        if (project.demoUrl) {
            actions.appendChild(
                externalLink(project.demoUrl, "Open the demo", "button button-secondary")
            );
            hasAction = true;
        }

        if (hasAction) {
            header.appendChild(actions);
        }

        return header;
    }

    /* ------------------------------------------------------------------
       Publication citation block
       ------------------------------------------------------------------ */

    function renderPublication(project) {
        var wrapper = section("publication", "Publication");
        var card = element("div", "case-citation");

        card.appendChild(element("p", "case-citation-title", project.citation.title));

        if (project.citation.source) {
            var source = element("p", "case-citation-source");
            source.appendChild(element("cite", null, project.citation.source));

            if (project.citation.detail) {
                source.appendChild(
                    document.createTextNode(" · " + project.citation.detail)
                );
            }

            card.appendChild(source);
        }

        if (project.doi) {
            card.appendChild(element("p", "case-citation-doi", "DOI: " + project.doi));
        }

        card.appendChild(
            externalLink(project.publicationUrl, "View publication", "case-citation-link")
        );

        wrapper.appendChild(card);
        return wrapper;
    }

    /* ------------------------------------------------------------------
       Previous / next
       ------------------------------------------------------------------ */

    function renderPager(index) {
        var previous = projects[index - 1];
        var next = projects[index + 1];

        if (!previous && !next) {
            return null;
        }

        var nav = element("nav", "case-pager");
        nav.setAttribute("aria-label", "Previous and next project");

        if (previous) {
            var back = element("a", "case-pager-link case-pager-previous");
            back.href = "project.html?id=" + encodeURIComponent(previous.id);
            back.appendChild(element("span", "case-pager-label", "Previous project"));
            back.appendChild(element("span", "case-pager-title", previous.shortTitle));
            nav.appendChild(back);
        }

        if (next) {
            var forward = element("a", "case-pager-link case-pager-next");
            forward.href = "project.html?id=" + encodeURIComponent(next.id);
            forward.appendChild(element("span", "case-pager-label", "Next project"));
            forward.appendChild(element("span", "case-pager-title", next.shortTitle));
            nav.appendChild(forward);
        }

        return nav;
    }

    /* ------------------------------------------------------------------
       SEO
       ------------------------------------------------------------------ */

    function setMeta(selector, value) {
        var tag = document.querySelector(selector);

        if (tag) {
            tag.setAttribute("content", value);
        }
    }

    function applySeo(project) {
        var url = SITE_ORIGIN + "/project.html?id=" + encodeURIComponent(project.id);
        var pageTitle = project.title + " | Sourav Chandra";
        var description = project.summary;

        document.title = pageTitle;

        setMeta('meta[name="description"]', description);
        setMeta('meta[property="og:title"]', pageTitle);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[property="og:url"]', url);
        setMeta('meta[name="twitter:title"]', pageTitle);
        setMeta('meta[name="twitter:description"]', description);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = url;
        }

        if (project.image) {
            setMeta('meta[property="og:image"]', SITE_ORIGIN + "/" + project.image);
        }

        // Structured data only where there is a real publication behind it.
        // An unpublished project is never described as a scholarly article.
        var data = {
            "@context": "https://schema.org",
            "@type": project.publicationUrl ? "ScholarlyArticle" : "CreativeWork",
            name: project.title,
            headline: project.title,
            description: description,
            url: url,
            author: { "@type": "Person", name: "Sourav Chandra" }
        };

        if (project.doi) {
            data.identifier = "https://doi.org/" + project.doi;
        }

        if (project.githubUrl) {
            data.codeRepository = project.githubUrl;
        }

        var script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data, null, 4);
        document.head.appendChild(script);
    }

    /* ------------------------------------------------------------------
       Build
       ------------------------------------------------------------------ */

    function renderProject(project, index) {
        article.appendChild(renderHeader(project));

        var body = element("div", "case-body");

        function add(condition, node) {
            if (condition) {
                body.appendChild(node);
            }
        }

        if (project.problem) {
            var problem = section("problem", "Research Problem");
            problem.appendChild(element("p", null, project.problem));
            body.appendChild(problem);
        }

        if (isFilledArray(project.objectives)) {
            var objectives = section("objectives", "Research Objectives");
            objectives.appendChild(bulletList(project.objectives));
            body.appendChild(objectives);
        }

        if (isFilledArray(project.dataset)) {
            var dataset = section("dataset", "Dataset and Input Data");
            dataset.appendChild(bulletList(project.dataset));
            body.appendChild(dataset);
        }

        if (isFilledArray(project.methodology)) {
            var methodology = section("methodology", "Methodology");
            methodology.appendChild(bulletList(project.methodology));
            body.appendChild(methodology);
        }

        add(isFilledArray(project.workflow), renderWorkflow(project.workflow || []));
        add(isFilledArray(project.results), renderResults(project.results || []));

        if (isFilledArray(project.technologies)) {
            var tech = section("technologies", "Tools and Technologies");
            tech.appendChild(
                chipList(project.technologies, "case-tech", "Tools and technologies")
            );
            body.appendChild(tech);
        }

        if (isFilledArray(project.limitations)) {
            var limitations = section("limitations", "Limitations");
            limitations.appendChild(bulletList(project.limitations));
            body.appendChild(limitations);
        }

        if (isFilledArray(project.futureWork)) {
            var future = section("future-work", "Future Work");
            future.appendChild(bulletList(project.futureWork));
            body.appendChild(future);
        }

        if (project.citation && project.publicationUrl) {
            body.appendChild(renderPublication(project));
        }

        if (project.githubUrl) {
            var repository = section("repository", "Repository");
            repository.appendChild(
                externalLink(
                    project.githubUrl,
                    "View the source on GitHub",
                    "case-repository-link"
                )
            );
            body.appendChild(repository);
        }

        article.appendChild(body);

        var pager = renderPager(index);
        if (pager) {
            article.appendChild(pager);
        }

        var breadcrumbCurrent = document.querySelector("#breadcrumb-current");
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = project.shortTitle;
        }

        applySeo(project);
        article.hidden = false;

        // Drop the unused branch entirely rather than leaving a hidden <h1>
        // in the document, so each page holds exactly one first-level
        // heading.
        if (notFound.parentNode) {
            notFound.parentNode.removeChild(notFound);
        }
    }

    function showNotFound(requestedId) {
        var detail = document.querySelector("#not-found-detail");

        if (detail && requestedId) {
            detail.textContent =
                'No case study matches the identifier "' + requestedId + '".';
        }

        document.title = "Project not found | Sourav Chandra";
        notFound.hidden = false;

        if (article.parentNode) {
            article.parentNode.removeChild(article);
        }

        var breadcrumbCurrent = document.querySelector("#breadcrumb-current");
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = "Project not found";
        }
    }

    var params = new URLSearchParams(window.location.search);
    var requestedId = params.get("id");
    var index = projects.findIndex(function (project) {
        return project.id === requestedId;
    });

    if (index === -1) {
        showNotFound(requestedId);
    } else {
        renderProject(projects[index], index);
    }

    // Exposed so the homepage can build "View case study" links without
    // repeating the URL shape.
    window.caseStudyUrl = function (id) {
        return "project.html?id=" + encodeURIComponent(id);
    };

    void internalLink;
})();
