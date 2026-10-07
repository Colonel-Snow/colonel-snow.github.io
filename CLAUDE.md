# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (default :5173) — see the `start` skill; run it in the background
npm run build    # tsc -b (project references) then vite build
npm run lint     # oxlint, NOT eslint — config in .oxlintrc.json
npm run preview  # serve the production build
```

There is no test framework in this project. Do not add test commands to docs or suggest running tests unless one is set up first.

**PATH caveat:** this shell does not source `~/.zprofile`, so `node`/`npm` are missing until you prefix commands with `export PATH="/opt/homebrew/bin:$PATH";`.

## Architecture

A personal portfolio site: Vite + React 19 + TypeScript, no router, no state library, no backend.

**Navigation is a `useState` tab switch, not routes.** [src/App.tsx](src/App.tsx) holds a single `Tab` value and renders one page component per branch. Adding a page means three coordinated edits: extend the `Tab` union and the `TABS` array in [src/components/TabNav.tsx](src/components/TabNav.tsx), then add the render branch in `App.tsx`. There are no URLs per section — deep links and back-button navigation do not work by design.

**Design tokens are the styling contract.** [src/styles/tokens.css](src/styles/tokens.css) defines the full type scale (base 16px, 1.25 ratio), weight, leading, tracking, 4px-based spacing scale, and a neutral color set with a `prefers-color-scheme: dark` override. Everything else must reference these custom properties rather than hardcoding px/rem or hex values; a raw value in a component stylesheet is a bug. [src/index.css](src/index.css) imports the tokens and applies them as element-level defaults (body type, `h1`–`h6`, the shared `.eyebrow` utility), so headings usually need no per-page type rules.

**CSS is global, isolated only by naming.** Each component and page has a co-located plain `.css` file imported from its `.tsx`. No CSS modules, no CSS-in-JS. Isolation comes from a BEM-style block prefix per file (`.scene__`, `.resume__`, `.gallery__`, `.tab-nav__`), so new selectors must stay under their block prefix or they will leak.

**Page content lives in module-level `const` arrays** inside each page file (`EXPERIENCE`/`EDUCATION`/`SKILLS` in [src/pages/Resume.tsx](src/pages/Resume.tsx), `PIECES` in [src/pages/Gallery.tsx](src/pages/Gallery.tsx), the scale tables in [src/pages/Foundations.tsx](src/pages/Foundations.tsx)). Content edits are data edits, not JSX edits.

[Foundations.tsx](src/pages/Foundations.tsx) is a living style guide that renders the token scales; if you change a token, update its entry there so the page stays truthful.

### Resume content is duplicated across two sources

The rendered resume in [src/pages/Resume.tsx](src/pages/Resume.tsx) and the LaTeX source in [public/resume/](public/resume/) hold the same career content in two formats, and the page links the `.tex` as a download. They are not generated from each other — a wording or dates change in one must be mirrored in the other by hand.

### Placeholders still in the repo

[Gallery.tsx](src/pages/Gallery.tsx) pulls images from `picsum.photos` by seed; these are stand-ins awaiting real artwork.
