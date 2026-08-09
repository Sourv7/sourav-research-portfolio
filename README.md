# Sourav Chandra — Research Portfolio

A responsive professional portfolio presenting my work in artificial
intelligence, bioinformatics, computational biology, and drug discovery.

Built as a dependency-free static site: three files, no framework, no build
step, no package manager.

## Live Website

[View the deployed portfolio](https://sourav-research-portfolio.vercel.app)

## Features

### Content and navigation

- Responsive sticky navigation with a scroll-synced active-section indicator
- Accessible mobile navigation menu (hamburger toggle, Escape to close)
- Two-column hero on desktop, single column on smaller screens
- About, research expertise, selected projects, research publications, and
  contact sections
- Project-category filtering with an accessible live status message
- Detailed research case studies on a reusable, data-driven project page
- Publication filtering by output type and by year
- Automatically updated copyright year

### Interaction and motion

- **Interactive molecular-network canvas** — an original 3D protein-network
  visualization drawn with a plain `<canvas>` and vanilla JavaScript. Nodes are
  projected from 3D to 2D with a perspective divide, joined by bonds, and sized,
  brightened, and depth-sorted according to distance from the camera.
- **Pointer parallax** — the network eases toward the pointer and drifts back to
  its idle rotation when the pointer stops or leaves the window.
- **Scroll-reveal animation** — sections, headings, and cards fade and rise into
  place once, driven by `IntersectionObserver`.
- **3D card tilt** — a restrained perspective tilt (maximum 5°) with a soft
  directional glare, following the pointer across each project and publication
  card. Pointer-capable desktop devices only.
- **Counting statistics** — the publication totals count up once, the first time
  the section scrolls into view.
- **Ambient depth** — a soft background gradient, two blurred colour orbs, and a
  faint scientific grid, all rendered behind the content with
  `pointer-events: none`.

## Project Case Studies

Each project on the homepage links to a detailed case study covering the
research problem, objectives, dataset, methodology, workflow, results,
limitations, and future work.

| Case study | URL |
| --- | --- |
| AI-Assisted NSCLC Drug Discovery | `project.html?id=nsclc-drug-discovery` |
| Protein–Peptide Multitask Deep Learning | `project.html?id=protein-peptide-multitask` |
| PPI-PLM Benchmark | `project.html?id=ppi-plm-benchmark` |
| STAT3 nsSNP Analysis | `project.html?id=stat3-variant-analysis` |
| Interpretable Breast Cancer ML | `project.html?id=breast-cancer-ml` |

An unrecognised or missing `id` renders a "Project not found" state with a
link back to the project list. It never renders a blank page.

### File structure

```text
index.html         homepage
project.html       reusable case-study page, driven by ?id=
project-data.js    structured data for every project (no DOM code)
project.js         case-study rendering, routing, and metadata
project.css        case-study styling, built on the tokens in styles.css
styles.css         design tokens and shared styling
script.js          navigation, filtering, reveal, tilt, hero canvas
```

`project.html` loads `project-data.js`, then `project.js`, then `script.js`,
in that order. The site script runs last so it finds the finished case-study
sections; because every lookup in it is guarded, the homepage-only parts
(hero canvas, publications, project filters) simply do not run there. No
JavaScript is duplicated between the two pages.

### Adding a case study

1. Append an object to `window.PORTFOLIO_PROJECTS` in `project-data.js`.
   Array order is display order, so put featured work first.
2. Required: `id`, `title`, `shortTitle`, `status`, `filterCategory`,
   `category`, `summary`, `role`. Everything else is optional.
3. `filterCategory` must match a `data-filter` value on a homepage filter
   button (`protein-ai`, `bioinformatics`, `machine-learning`). Add a new
   button to `index.html` first if you need a new one.
4. Omit optional fields entirely rather than setting them to `""`. The
   renderer draws a button only when its URL exists, so an absent
   `githubUrl` means no GitHub button — never an empty link.
5. `results` accepts plain strings, or `{ heading, note, items }` groups.
   `items` may hold strings or `{ label, value }` metric pairs. Use `note`
   whenever a number needs a qualifier.

Both the homepage card and the case-study page are generated from that one
object. There is nothing to update in `index.html`.

### Updating project data

Edit `project-data.js` only. The homepage cards and the case-study pages read
the same array, so a change appears in both places. Nothing in the markup
needs to be kept in sync by hand.

### Research integrity

This is a public research portfolio, so a number on it is a claim.

- Do not state a result that is not traceable to a published paper, a
  repository, or a manuscript.
- Label every metric with the dataset it came from. Never combine values from
  different datasets into a single headline figure.
- Where a repository's checked-in metrics come from a synthetic or smoke
  benchmark, say so on the page, in the `note` field of the result group.
  Two case studies currently do this.
- Do not describe an unpublished project as a published scholarly article.
  JSON-LD is emitted as `ScholarlyArticle` only when a publication URL
  exists, and as `CreativeWork` otherwise.
- Never publish credentials, tokens, private paths, unpublished datasets,
  proprietary source, or client names. Nothing confidential belongs in
  `project-data.js`, which is served to every visitor.


## Research Publications

The Publications section lists every verified research output: **6 peer-reviewed
journal articles** and **2 preprints**, for **8 research outputs** in total.

Each card shows the publication type, the year, the full title, the complete
author list, the journal or preprint server, the volume, pages, or article
number where one exists, the DOI, and a link that opens the publisher's page in
a new tab. My own name is emphasised wherever it appears in an author list, in
either name order.

### Preprints are labelled separately

Journal articles and preprints never share a badge. Peer-reviewed articles are
marked **Journal Article** in blue with a solid outline; preprints are marked
**Preprint — Not Peer Reviewed** in violet with a dashed outline. The
distinction is carried by the wording and the border style as well as the
colour, so it survives greyscale and colour-blind viewing. Nothing that has not
been peer reviewed is ever presented as though it has been.

### Where the records live

Publication records are maintained in `script.js`, in the array named
`publications` in section 5 of the file. There is no database, no CMS, and no
build step: the cards in `index.html` are generated from that array at run time,
so the array is the single source of truth for both the cards and the summary
statistics above them.

### Adding a new publication

1. Open `script.js` and find the `publications` array.
2. Copy an existing entry and add it in the correct position. The array is
   ordered newest first, and the page renders it in array order.
3. Fill in the fields:

   | Field | Required | Notes |
   | --- | --- | --- |
   | `id` | yes | Unique, lowercase, hyphenated. Becomes the card's HTML `id`. |
   | `title` | yes | Full title, no truncation. |
   | `authors` | yes | Complete author list, comma separated, in publication order. |
   | `source` | yes | Journal name, or the preprint server. |
   | `date` | yes | Human-readable publication date. |
   | `year` | yes | Number, not a string. Drives the year filters. |
   | `type` | yes | Either `"journal"` or `"preprint"`. Drives the badge and the type filters. |
   | `label` | yes | `"Journal Article"` or `"Preprint — Not Peer Reviewed"`. |
   | `volume` | no | Omit when there is none. |
   | `pages` | no | Omit when there is none. |
   | `articleNumber` | no | Omit when there is none. |
   | `doi` | yes | Bare DOI, with no `https://doi.org/` prefix. |
   | `url` | yes | Full https link to the publisher's page. |

4. If the new entry introduces a year that has no filter button yet, add one to
   the publication filter group in `index.html`, using
   `data-publication-filter="YYYY"`.
5. The three statistics recount themselves from the array. The figures in
   `index.html` are a no-JavaScript fallback, so update them to match.

Optional fields must be left out entirely rather than set to an empty string;
the detail line is only rendered when at least one of them is present.

## Contact form

The form posts to `/api/contact`, a Vercel serverless function. No build step
and no `package.json` are needed — dropping the file in `/api` is enough.

Set three environment variables in the Vercel dashboard under
**Settings → Environment Variables**, for every environment:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | An API key from [resend.com](https://resend.com) (free tier is enough) |
| `CONTACT_TO` | The address that receives messages |
| `CONTACT_FROM` | A verified sender. `onboarding@resend.dev` works for testing |

Until they are set, the endpoint returns 503 and the form tells the visitor to
use the profile links instead, so nothing is lost silently.

The recipient address exists only in the environment variables, never in the
page, so it is not exposed to scrapers. Submissions are filtered by a honeypot
field, server-side validation, and a short per-address rate limit.

## Academic profiles and CV

Profile links live in the contact section of `index.html`. ORCID and GitHub
are live. Google Scholar, LinkedIn, and the CV download are present but
commented out, deliberately: a placeholder link is worse than no link.

To enable them:

1. **Google Scholar / LinkedIn** — uncomment the block in the contact section
   and replace `YOUR_ID` / `YOUR_HANDLE`.
2. **CV** — add `cv.pdf` to the repository root, then uncomment the CV button.
   Check the file is free of phone numbers, home addresses, and anything else
   you would not publish on a public page.

## SEO

- `sitemap.xml` lists the homepage and all five case studies. Regenerate it
  when you add a project.
- `robots.txt` allows everything and points at the sitemap.
- `og-image.png` (1200×630) is generated from the site's own design tokens.
- Favicons, an Apple touch icon, and `site.webmanifest` are in the root.
- Case-study pages rewrite title, description, canonical, and Open Graph tags
  per project, and emit `ScholarlyArticle` JSON-LD only where a publication
  exists.

After deploying, submit the sitemap in Google Search Console and request
indexing for the homepage.

## Analytics

Vercel Web Analytics and Speed Insights are loaded from `/_vercel/`. Both are
cookie-free and do no cross-site tracking, so no consent banner is required.
They must be switched on in the Vercel dashboard under **Analytics** and
**Speed Insights**; until then the script requests 404 harmlessly.


## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a single `<h1>`
- Correct heading order with no skipped levels
- A "Skip to main content" link that becomes visible on keyboard focus
- `aria-expanded` on the menu toggle, `aria-pressed` on every filter button,
  and `aria-current="location"` on the active navigation link
- Filter results, for both projects and publications, announced through a polite
  `role="status"` region
- Hidden cards use the `hidden` attribute, so they leave both the tab order and
  the accessibility tree
- Visible focus rings that meet the WCAG 3:1 non-text contrast minimum; all body
  and heading text meets or exceeds 4.5:1
- The decorative canvas is wrapped in `aria-hidden="true"` and is not focusable
- Touch targets are at least 44 px, including every publication and
  case-study link
- Case-study pages carry a breadcrumb with `aria-current="page"`, one `<h1>`,
  and no skipped heading levels
- Links that open in a new tab say so through visually hidden text, and
  card links name the project they belong to rather than repeating
  "View case study"
- Project status is written as a word, never signalled by colour alone
- The workflow is an ordered list with real text, not an image
- No information is conveyed by colour or animation alone
- Full support for `prefers-reduced-motion: reduce`

## Reduced motion

When `prefers-reduced-motion: reduce` is set:

- the canvas draws a single static frame and never starts an animation loop
- pointer parallax and card tilt are switched off
- scroll-reveal classes are never applied, so content renders at full opacity
- the publication statistics are written directly rather than counted up
- CSS transitions and keyframes are reduced to a negligible duration

## Performance

- No frameworks, no external requests, no fonts, images, or video to download
- The molecule is a rigid body, so bond pairs are computed **once** at build
  time; only the rotation is recalculated each frame
- Node positions live in preallocated `Float32Array` buffers — nothing large is
  allocated inside the animation loop
- Glow is drawn from three pre-rendered 64 px sprites instead of per-frame
  `shadowBlur` or gradient creation
- Node count adapts to viewport width (26 / 34 / 54)
- Device pixel ratio is capped at 2 so high-density displays stay sharp without
  quadrupling the fill cost
- The loop is stopped when the tab is hidden and when the hero scrolls out of
  view, and restarted on return
- The canvas owns the only continuous animation loop on the page. Card tilt,
  filter transitions, and the counting statistics use short
  `requestAnimationFrame` callbacks that settle and stop
- Publication cards are built into a single `DocumentFragment` and appended in
  one operation, so the list costs one layout rather than eight
- Card tilt reads each card's bounding rectangle once per hover, not per frame,
  and writes are batched into a single `requestAnimationFrame`
- Animation uses only `transform` and `opacity`; sizes are fixed up front to
  avoid cumulative layout shift

## Progressive enhancement

The site is readable with JavaScript disabled: reveal animations are applied by
adding classes from JavaScript, so nothing is hidden by default, and the hero
visualization degrades to a soft CSS gradient behind the empty canvas.

The publication cards are the one exception. They are generated from the
`publications` array, so with JavaScript off the section renders its heading,
introduction, and statistics, and a `<noscript>` message points to the full
record elsewhere.

## Technologies

- HTML5
- CSS3 (custom properties, grid, `backdrop-filter`)
- Vanilla JavaScript (Canvas 2D, `IntersectionObserver`, Pointer Events)
- Git and GitHub
- Vercel

## Local Preview

Serve the folder over HTTP rather than opening the file directly, so that
relative paths and `IntersectionObserver` behave as they do in production:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## Planned Improvements

- Per-project Open Graph images
- Google Scholar and LinkedIn profile links
- CV download
- Dark-mode option
