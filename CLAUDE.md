# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (default :5173) — see the `start` skill; run it in the background
npm run build    # tsc -b (project references) then vite build
npm run lint     # oxlint, NOT eslint — config in .oxlintrc.json
npm run preview  # serve the production build
```

There is no test framework in this project. Do not add test commands to docs or suggest running tests unless one is set up first. `npm run build` is the type check; run it and `npm run lint` to verify a change.

**PATH caveat:** this shell does not source `~/.zprofile`, so `node`/`npm` are missing until you prefix commands with `export PATH="/opt/homebrew/bin:$PATH";`.

**Deploy:** every push to `main` builds and publishes to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Pushing to `main` therefore publishes the site, so treat it as outward-facing. The repo is the user site `colonel-snow.github.io`, served from `/`, which is why [vite.config.ts](vite.config.ts) sets no `base` and absolute paths like `/resume/resume.tex` work. If the site ever moves to a project repo, both of those break. `dist/` is build output and stays gitignored.

**TypeScript settings that bite:** `verbatimModuleSyntax` (type-only imports must say `type`, as in `import { type Tab }`), `erasableSyntaxOnly` (no `enum`, `namespace`, or constructor parameter properties), and `noUnusedLocals`/`noUnusedParameters`, which make the build fail on unused code rather than just warn.

## Architecture

A personal portfolio site: Vite + React 19 + TypeScript, no router, no state library, no backend.

**Navigation is a `useState` tab switch, not routes.** [src/App.tsx](src/App.tsx) holds a single `Tab` value (`home | work | foundations | gallery | resume`) and renders one page component per branch. Adding a page means three coordinated edits: extend the `Tab` union and the `TABS` array in [src/components/TabNav.tsx](src/components/TabNav.tsx), then add the render branch in `App.tsx`. There are no URLs per section, so deep links and the back button do not work. That is by design.

Pages can navigate too. Home receives `onNavigate` and uses it in its viewfinder `MENU`, the SD-card button (to `resume`), and the Work card (to `work`). Renaming or removing a tab id means updating those call sites as well; the `Tab` type will flag them.

**Site controls sit outside the page.** `TabNav` (a gear button that opens a popover menu) and `VersionPill` render inside `.site-controls` in `App.tsx`, as a sibling of `.app-shell` and never inside a page. They are `position: fixed` with `isolation: isolate`, so nothing a page does to stacking, layout, or palette can affect them. Keep new global chrome there, not inside a page.

**Versions are values, not pages.** A page can have several design versions (Home has `01` and `02`), switched by the pill in [src/components/VersionPill.tsx](src/components/VersionPill.tsx). A version is *not* a new page and *not* a new component. It is a block of custom properties at the foot of that page's stylesheet. `App` keeps the chosen version in its own state, falls back to the page's first version when the current choice doesn't exist on that page, and passes it down. The page spreads it onto a `data-version` attribute without ever branching on it, and CSS does the rest. Pages register their versions in `PAGE_VERSIONS` in `App.tsx`. A page with no entry there has one version, and the pill is not rendered for it.

Adding a version to Home is therefore two edits: copy a `.scene[data-version='NN']` block at the bottom of [src/pages/Home.css](src/pages/Home.css) and change the values, then add the id to `VERSIONS` in [src/pages/Home.versions.ts](src/pages/Home.versions.ts). No `.tsx` changes. The version-contract comment in `Home.css` lists the knobs: `--scene-inset-x/y`, the `--color-hud*` palette and `--shadow-hud`, `--name-*` and `--tagline-*` type, `--rec-animation`, `--corner-radius`, and `--scrim-fill`. Rules consume these knobs; version blocks supply them. Each version declares the full set rather than diffing against another, so any version can be deleted by deleting its block. Each version also needs its own entries in the `min-width: 1024px` and `max-width: 720px` inset overrides at the very end of the file.

If a version ever needs different *markup* rather than different values, that is the point to branch inside the page component or extract a swappable region. It is still not a new page.

The version list lives in its own module rather than in `Home.tsx` because a component file that also exports constants loses React Fast Refresh, which would make every style tweak a full reload. The oxlint rule `react/only-export-components` enforces the same thing.

### Home is a camcorder viewfinder

[src/pages/Home.tsx](src/pages/Home.tsx) is the most involved page. Things to know before editing it:

- **Scenes are not versions.** `SCENES` holds two photographs (`day` sunset and `night` aurora), and the exposure button cycles between them. Each scene carries its framing data (`aspect`, `anchor`, `zoom`, `offsetY`), passed in as inline custom properties. Per-scene typography is keyed on `data-scene` in `Home.css`. A scene is independent of a version, of the site's light/dark mode, and of `prefers-color-scheme`.
- **`aspect` must match the image file**, and `offsetY` can only pan within the spare height that `zoom` creates, or the photo stops covering the frame.
- **Handheld drift runs outside React.** `useHandheldDrift` writes `--pointer-x`/`--pointer-y` directly onto the node on each animation frame, and stops itself once the motion settles. It is skipped on touch devices and under `prefers-reduced-motion`. Don't route this through state.
- **The iris animation replays by toggling a class.** Changing scene removes `scene--iris`, forces a reflow (`void node.offsetWidth`), and adds it back. The first paint skips this because the class is already in the markup.
- The name is split into two `<span>`s on purpose, so the gull in the sunset photo flies through the gap.

### Styling

[DESIGN.md](DESIGN.md) holds the visual language: the viewfinder concept, the three surfaces (photo, page, floating chrome), type voices, motion and accessibility rules, and known inconsistencies. Read it before designing or restyling anything. This section covers only the mechanics.

**Design tokens are the styling contract.** [src/styles/tokens.css](src/styles/tokens.css) defines the font stacks, the type scale (base 16px, 1.25 ratio, plus a fluid `--text-display`), weight, leading, tracking, the 4px-based spacing scale, borders, radii, a neutral color set with a `prefers-color-scheme: dark` override, the HUD/scrim/map colors used over photographs, the frosted `--color-chrome*` set used by the site controls, and z-index layers (`--layer-overlay`, `--layer-controls`). Everything else must reference these custom properties rather than hardcoding px/rem or hex values; a raw value in a component stylesheet is a bug. There are three established exceptions:

- Media-query breakpoints (`720px`, `1024px`), because custom properties can't be used in `@media`.
- Home's version blocks, which *redefine* the `--color-hud*` tokens within the scene.
- Home's drift distances.

[src/index.css](src/index.css) imports the tokens and applies them as element-level defaults (body type, `h1`–`h6`, the shared `.eyebrow` utility), so headings usually need no per-page type rules. The one typeface, Chakra Petch, is loaded from Google Fonts in [index.html](index.html), and all three font stacks lead with it.

**CSS is global, isolated only by naming.** Each component and page has a co-located plain `.css` file imported from its `.tsx`. No CSS modules, no CSS-in-JS. Isolation comes from a BEM-style block prefix per file (`.scene__`, `.work__`, `.resume__`, `.gallery__`, `.tab-nav__`, `.version-pill__`), so new selectors must stay under their block prefix or they will leak. Component state is expressed with data attributes (`data-active`, `data-version`, `data-scene`) rather than modifier classes.

### Content

**Page content lives in module-level `const` arrays** inside each page file (`SCENES`/`MENU` in [Home.tsx](src/pages/Home.tsx), `PROJECTS` in [src/pages/Work.tsx](src/pages/Work.tsx), `EXPERIENCE`/`EDUCATION`/`SKILLS` in [src/pages/Resume.tsx](src/pages/Resume.tsx), `PIECES` in [src/pages/Gallery.tsx](src/pages/Gallery.tsx), the scale tables in [src/pages/Foundations.tsx](src/pages/Foundations.tsx)). Content edits are data edits, not JSX edits.

[Foundations.tsx](src/pages/Foundations.tsx) (the tab labelled "Typography & Components") is a living style guide that renders the token scales; if you change a token, update its entry there so the page stays truthful.

### Resume content is duplicated across two sources

The rendered resume in [src/pages/Resume.tsx](src/pages/Resume.tsx) and the LaTeX source in [public/resume/](public/resume/) hold the same career content in two formats, and the page links the `.tex` as a download. They are not generated from each other, so a wording or dates change in one must be mirrored in the other by hand.

There are two `.tex` files. `resume.tex` is the one the page links and the one `Resume.tsx` mirrors. `resume-2.tex` is a newer draft with a restyled header and an added Graduate Teaching Assistant role. It contains open `% TODO` notes (an assumed start date, an `[N]` headcount, a date collision with the ConstructConnect internship), and neither the page nor `Resume.tsx` reflects it yet.

### Placeholders still in the repo

- [Gallery.tsx](src/pages/Gallery.tsx) pulls images from `picsum.photos` by seed; these are stand-ins awaiting real artwork.
- `PROJECTS` in [Work.tsx](src/pages/Work.tsx) is placeholder copy, and the project frames have no images yet.
- The `Play` item in Home's viewfinder menu is a non-interactive label until it has somewhere to go.
- `src/assets/hero-scene.jpg` and `hero-scene.png` are not imported anywhere. Home uses `hero-scene-2.jpeg`.
