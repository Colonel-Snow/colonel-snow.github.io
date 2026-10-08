# DESIGN.md

The visual language of this portfolio: what it should feel like, and the rules that produce that feel. [CLAUDE.md](CLAUDE.md) covers the mechanics (where tokens live, how versions are wired). This file covers the intent behind them. Read it before designing or restyling anything.

Values below are named by token. The source of truth is [src/styles/tokens.css](src/styles/tokens.css). If this file and the tokens disagree, the tokens win and this file is out of date.

## Concept: a camcorder viewfinder

The site is seen through a camera. Home is a full-bleed photograph with recording chrome laid over it: a REC light, a running timecode, corner brackets, a metering ring, a grid-map readout, and an "exposure" switch. The rest of the site is quieter content pages that keep traces of the same instrument, like monospace readouts, frame corners and numbered shots.

Three ideas run through every decision:

1. **It is an instrument, not decoration.** Every piece of chrome should look like it does something on a real camera. Brackets mark the frame, the ring meters the light, the timecode counts. If a flourish has no camera equivalent, it probably doesn't belong.
2. **Mechanism over ornament.** Motion copies how hardware moves. The iris blades rotate as they retract. The REC light blinks in hard steps. The frame drifts as if hand-held. Avoid generic fades and bounces.
3. **Quiet until wanted.** Tools for looking at the work, like the site menu and the version switch, sit at 45% opacity and come up on hover or focus. They are not part of the work and shouldn't compete with it.

## Surfaces

Every element sits on one of three surfaces, and each surface has its own color rules. Decide which one you are on before choosing a color.

| Surface | Where | Color source | Follows light/dark mode? |
|---|---|---|---|
| **Photo** | Home | `--color-hud*`, `--color-scrim`, `--color-map-*`, `--shadow-hud` | No. These colors sit on a photograph, not on the page background. |
| **Page** | Work, Resume, Foundations, Gallery | `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent` | Yes, via `prefers-color-scheme` |
| **Floating chrome** | Gear menu, version pill | `--color-chrome*` backing, `--color-hud*` ink, `--blur-chrome`, `--shadow-chrome` | No. It carries its own dark, blurred backing so it stays legible over both a photo and a light page. |

A section may override the page tokens **inside its own block** to set a local mood. Gallery does this with a warm cream "vintage shop" palette, and Home's version blocks do it for the HUD palette. Override tokens that way, scoped to the block. Never introduce new one-off colors in rules.

## Typography

**One typeface: Chakra Petch** (400–700, loaded from Google Fonts in [index.html](index.html)). Its squared-off, technical letterforms are what make the HUD read as equipment lettering. All three stacks, `--font-sans`, `--font-display` and `--font-mono`, lead with it. The stacks differ only in fallbacks and in the *role* they signal:

- `--font-sans`: body copy and interface text.
- `--font-display`: viewfinder titles, menu items, HUD labels.
- `--font-mono`: readouts such as timecodes, project numbers and metadata lines. Pair it with `font-variant-numeric: tabular-nums` when digits change in place.

Scale: base 16px, 1.25 ratio, `--text-xs` (12) through `--text-6xl` (72), plus fluid `--text-display` (`clamp(30px, 4.5vw, 60px)`) for the hero name.

Type has two voices, and they shouldn't be mixed:

- **The instrument voice** (HUD, menus, labels, tags) is UPPERCASE with tracking opened up: `--tracking-wide` (0.04em) for labels and `--tracking-wider` (0.12em) for viewfinder lettering, at medium or semibold weight. This is how equipment stencils a label.
- **The page voice** (headings, body) uses sentence case and tight headings (`--tracking-tight`, `--leading-tight`/`--leading-snug`, semibold). Body text is `--leading-normal`, and long-form blocks use `--leading-relaxed` with a measure of about 46–54ch.

The `.eyebrow` utility (12px, semibold, uppercase, wide, muted) is the bridge between the two voices: an instrument-voice label above a page-voice heading. Use it to open every content page.

Heading defaults come from [src/index.css](src/index.css): `h1` 60px, `h2` 36px, `h3` 24px. Most pages need no per-page heading rules.

## Color

**Page neutrals** (light / dark):

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#ffffff` | `#121214` |
| `--color-text` | `#1a1a1e` | `#f2f2f4` |
| `--color-text-muted` | `#6b6b73` | `#9a9aa3` |
| `--color-border` | `#e5e4e7` | `#2a2a2f` |
| `--color-accent` | `#3b3bff` | `#8f8fff` |

Use the accent sparingly. Today it appears only on Resume links. Most hierarchy comes from muted versus full text, not from color.

**HUD ink** is white at several strengths: full for text, `-line` (88%) for hairlines, `-dim` (78%) for secondary text, and `-veil` (28%) for filled or hovered chrome. The only hue on the photo surface is `--color-hud-rec` red, and it is used for the REC dot and nothing else. Legibility over the photograph comes from `--shadow-hud` on text and a light scrim (`--color-scrim`, 12% black), not from panels behind the type.

## Space, layout, shape

- **Spacing** uses a 4px base: `--space-1` (4) through `--space-10` (128). Compose larger distances from tokens with `calc()` (for example `calc(var(--space-10) + var(--space-7))`) rather than adding new values.
- **Content pages** are a single centered column with generous vertical padding (`--space-9`/`--space-10` top and bottom). Widths: Resume and Foundations 720px, Work 860px, Gallery 1280px.
- **Breakpoints:** `720px` (phone), `1024px` (desktop, where Home's chrome moves further in from the edges). Gallery additionally uses 800px and 480px for its grid.
- **Lines are hairlines.** Use `--border-thin` (1px) for structure. `--border-thick` (2px) is for focus rings and Work's frame corners.
- **Brackets, not boxes.** Frames are drawn as open corners: a bordered element with two sides set to `transparent`. Use this instead of closed rectangles whenever something should read as "in frame".
- **Radii:** `--radius-md` (8px) for cards and thumbnails, `--radius-lg` (16px) for floating panels, `--radius-pill` for toggles, tags and the REC lozenge. HUD brackets stay square, except where a version sets `--corner-radius`.

## Components

**Photo surface (Home)**

- *Bracket*: an open-corner hairline frame holding a cluster of items (REC plus timecode at top left; tools at top right).
- *REC lozenge*: a pill outline with a 12px red dot that glows (`box-shadow` in the same red), uppercase display type. Its animation comes from the version.
- *Tools*: 24px line icons (1.5 stroke, `currentColor`), no background, `scale: 1.15` on hover. Brand marks such as LinkedIn use the real logo, filled, not a redrawn version.
- *Viewfinder menu*: a vertical uppercase stack centered on the left edge. The active item is larger and bold. Hover brightens an item and nudges it 8px right, toward the frame. An item with nowhere to go is a plain label, not a button.
- *Metering ring*: an elliptical veil-strength stroke masked by a conic gradient, so it fades out at the sides, with center ticks on each edge.
- *Corner cards*: an 8px-radius thumbnail with a pair of labels under it, split to opposite ends. The map card masks a coastline PNG with flat `--color-map-land` color under a 32px grid, and grows upward on hover.
- *Meta column*: right-aligned type mirroring the menu across the frame, held one space clear of the right-edge rule.

**Page surface**

- *Intro*: `.eyebrow`, then `h1`, then a muted body paragraph at `--text-md`, relaxed leading, about 48ch.
- *Numbered frame* (Work): a 4:3 plate in `--color-border` with four 2px bracket corners and a large mono index (`01`, `02`…). This is how the viewfinder language carries over to a light page.
- *Mono meta line*: 12px mono, uppercase, wide, muted, with items split to opposite ends.
- *Tag*: pill outline in `--color-border`, 12px uppercase muted text.
- *Section title* (Resume): small uppercase muted label with a hairline rule under it.

**Floating chrome**

- *Gear toggle*: a 32px circle. On hover the gear turns 90° and the button scales to 1.1. It opens a panel that rises 8px into place over 0.18s.
- *Version pill*: a segmented pill. The active segment has a solid HUD-white fill with dark text. Use tabular figures so the widths don't shift.

## Motion

- **Hover transitions** are short and plain: 0.15–0.2s `ease` for color and scale, and 0.35–0.4s for rotation and size changes (gear, map). Hover scale stays small: 1.05 for list items, 1.1–1.15 for icon buttons.
- **The iris** opens Home: a six-blade hexagonal `clip-path` that rotates as it opens, over 0.9s `cubic-bezier(0.16, 1, 0.3, 1)`. The HUD follows at 1.05s, the way a viewfinder wakes after the lens. It replays on every exposure change.
- **Handheld drift**: layers move against the pointer by different amounts (photo 16×10px, focus frame 6×4px, brackets fixed to the glass), which reads as depth. It is written directly to CSS variables, never through React state.
- **REC light**: version 01 blinks in hard steps (`steps(1)`, 1.4s), like a warning light. Version 02 pulses smoothly (3.2s), like a tally lamp.
- **Required:** every animation and transition is turned off under `prefers-reduced-motion: reduce`. Pointer-driven effects only run on `(hover: hover)` devices. Any new motion must follow both rules.

## Accessibility

- **Focus ring:** `outline: var(--border-thick) solid` in the surface's ink (`--color-hud` on photo and chrome surfaces), offset `--space-1`. Inset it (negative offset) inside tight lists. Always use `:focus-visible`.
- Icon-only buttons need an `aria-label` that names the result ("Change exposure to Aurora", "Open resume"). Links that leave the site say so ("opens in a new tab").
- Decorative chrome (brackets, ticks, ring, map) is `aria-hidden`. Photographs get alt text that describes the scene, not "hero image".
- Toggles expose their state with `aria-pressed`, `aria-expanded` or `aria-current`. Styling keys off `data-active`.

## Versions of Home

Versions are alternative design directions for the same markup, set entirely by token values (see [CLAUDE.md](CLAUDE.md)). They are the place to explore a direction without forking the page.

| | 01 — camcorder | 02 — glass |
|---|---|---|
| Ink | pure `#ffffff` | warm off-white `#f7f4f0`. Lines are about a third fainter. |
| Name / tagline | semibold, tracked wider. Tagline is full ink. | regular, tracked wide. Tagline is dimmed. |
| Edge inset (mobile / base / desktop) | 16 / 24 / 64×48 | 16 / 48×32 / 96×64 |
| Corners | square | `--radius-lg` |
| Scrim | flat 12% wash | edge vignette, so the subject stays clear |
| REC | hard blink | soft pulse |

The difference between them: 01 is equipment chrome, and 02 is the same instrument drawn as if it were lens glass with a coating. Pure white on a photograph reads as a screenshot. A slightly warm white reads as part of the optics.

## Designing something new

1. **Pick the surface** (photo, page or floating chrome), and with it the color set.
2. **Start from the tokens.** If a value you need is missing, add a token and a matching entry in [Foundations.tsx](src/pages/Foundations.tsx) rather than writing a raw value.
3. **Borrow the viewfinder language at the right strength.** Home commits to it fully. Content pages take only a trace, as Work does: brackets on frames, mono numbering, uppercase meta lines.
4. **Give it a mechanical reason.** Ask what a camera would do here.
5. **Respect reduced motion and focus-visible** from the first commit.

## Known inconsistencies

These exist in the code today. Fix them, or update this file, when you touch the area.

- The Foundations type table labels H1 as `--text-4xl` (48) and H3 as `--text-2xl` (30), but [index.css](src/index.css) renders `h1` at 60px and `h3` at 24px.
- `--font-extrabold` (800) is defined, but Chakra Petch is only loaded up to 700, and `font-synthesis: none` means 800 renders as 700.
- Some raw values remain in stylesheets:
  - **Gallery** — its cream background and mat colors, `4px`/`2px`, `clamp(1.5rem…)` padding, and its shadows.
  - **Resume** — the section rule's `1px`.
  - **The version pill** — the active text's `#121214`.
- `--color-accent` has no role defined beyond Resume links.
