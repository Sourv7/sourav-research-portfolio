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
- About, research expertise, selected projects, and contact sections
- Project-category filtering with an accessible live status message
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
- **3D project-card tilt** — a restrained perspective tilt (maximum 5°) with a
  soft directional glare, following the pointer across each card.
- **Ambient depth** — a soft background gradient, two blurred colour orbs, and a
  faint scientific grid, all rendered behind the content with
  `pointer-events: none`.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a single `<h1>`
- Correct heading order with no skipped levels
- A "Skip to main content" link that becomes visible on keyboard focus
- `aria-expanded` on the menu toggle, `aria-pressed` on every filter button,
  and `aria-current="location"` on the active navigation link
- Filter results announced through a polite `role="status"` region
- Hidden project cards use the `hidden` attribute, so they leave both the tab
  order and the accessibility tree
- Visible focus rings that meet the WCAG 3:1 non-text contrast minimum; all body
  and heading text meets or exceeds 4.5:1
- The decorative canvas is wrapped in `aria-hidden="true"` and is not focusable
- Touch targets are at least 44 px
- No information is conveyed by colour or animation alone
- Full support for `prefers-reduced-motion: reduce`

## Reduced motion

When `prefers-reduced-motion: reduce` is set:

- the canvas draws a single static frame and never starts an animation loop
- pointer parallax and card tilt are switched off
- scroll-reveal classes are never applied, so content renders at full opacity
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
- Card tilt reads each card's bounding rectangle once per hover, not per frame,
  and writes are batched into a single `requestAnimationFrame`
- Animation uses only `transform` and `opacity`; sizes are fixed up front to
  avoid cumulative layout shift

## Progressive enhancement

The site is fully readable with JavaScript disabled. Reveal animations are
applied by adding classes from JavaScript, so nothing is hidden by default, and
the hero visualization degrades to a soft CSS gradient behind the empty canvas.

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

- Research publications section
- Contact form
- Dark-mode option
- Open Graph preview image
