import './Foundations.css'

const TYPEFACES = [
  {
    token: '--font-sans',
    label: 'Sans — Chakra Petch',
    sample: 'Body & interface',
  },
  {
    token: '--font-display',
    label: 'Display — Chakra Petch',
    sample: 'Viewfinder titles',
  },
  {
    token: '--font-mono',
    label: 'Mono — Chakra Petch',
    sample: 'Readouts & code',
  },
]

const TYPE_SCALE = [
  { token: '--text-6xl', px: 72, label: 'Hero' },
  { token: '--text-5xl', px: 60, label: 'Display' },
  { token: '--text-4xl', px: 48, label: 'H1' },
  { token: '--text-3xl', px: 36, label: 'H2' },
  { token: '--text-2xl', px: 30, label: 'H3' },
  { token: '--text-xl', px: 24, label: 'H4' },
  { token: '--text-lg', px: 20, label: 'Lead' },
  { token: '--text-md', px: 18, label: 'Body large' },
  { token: '--text-base', px: 16, label: 'Body' },
  { token: '--text-sm', px: 14, label: 'Caption' },
  { token: '--text-xs', px: 12, label: 'Eyebrow' },
]

const WEIGHTS = [
  { token: '--font-regular', value: 400, label: 'Regular' },
  { token: '--font-medium', value: 500, label: 'Medium' },
  { token: '--font-semibold', value: 600, label: 'Semibold' },
  { token: '--font-bold', value: 700, label: 'Bold' },
  { token: '--font-extrabold', value: 800, label: 'Extrabold' },
]

const RADII = [
  { token: '--radius-sm', label: '4px' },
  { token: '--radius-md', label: '8px' },
  { token: '--radius-lg', label: '16px' },
  { token: '--radius-pill', label: '999px' },
]

const OVERLAY = [
  { token: '--color-hud', label: 'Overlay ink' },
  { token: '--color-hud-dim', label: 'Overlay ink, dimmed' },
  { token: '--color-hud-line', label: 'Bracket & rule' },
  { token: '--color-hud-veil', label: 'Filled chrome' },
  { token: '--color-hud-rec', label: 'Recording dot' },
  { token: '--color-scrim', label: 'Photo scrim' },
  { token: '--color-chrome', label: 'Floating menu backing' },
  { token: '--color-chrome-hover', label: 'Floating menu, hovered' },
  { token: '--color-chrome-border', label: 'Floating menu hairline' },
]

const SPACE_SCALE = [
  { token: '--space-1', px: 4 },
  { token: '--space-2', px: 8 },
  { token: '--space-3', px: 12 },
  { token: '--space-4', px: 16 },
  { token: '--space-5', px: 24 },
  { token: '--space-6', px: 32 },
  { token: '--space-7', px: 48 },
  { token: '--space-8', px: 64 },
  { token: '--space-9', px: 96 },
  { token: '--space-10', px: 128 },
]

function Foundations() {
  return (
    <main className="foundations">
      <header className="foundations__intro">
        <p className="eyebrow">Foundations</p>
        <h1>Type &amp; spacing</h1>
        <p className="foundations__intro-body">
          The base scale everything else in this portfolio will be built on.
          Tokens live in <code>src/styles/tokens.css</code>.
        </p>
      </header>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Typefaces</h2>
        <ul className="font-scale">
          {TYPEFACES.map((face) => (
            <li key={face.token} className="font-scale__row">
              <span
                className="font-scale__sample"
                style={{ fontFamily: `var(${face.token})` }}
              >
                {face.sample}
              </span>
              <span className="font-scale__meta">
                <span className="font-scale__label">{face.label}</span>
                <span className="font-scale__token">{face.token}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Type scale</h2>
        <ul className="type-scale">
          {TYPE_SCALE.map((step) => (
            <li key={step.token} className="type-scale__row">
              <span
                className="type-scale__sample"
                style={{ fontSize: `var(${step.token})` }}
              >
                Aa
              </span>
              <span className="type-scale__meta">
                <span className="type-scale__label">{step.label}</span>
                <span className="type-scale__token">
                  {step.token} · {step.px}px
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="foundations__note foundations__note--after">
          <code>--text-display</code> is the fluid hero size used on Home:
          it scales between <code>--text-2xl</code> and <code>--text-5xl</code>{' '}
          with the viewport.
        </p>
      </section>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Weights</h2>
        <ul className="weight-scale">
          {WEIGHTS.map((weight) => (
            <li key={weight.token} className="weight-scale__row">
              <span
                className="weight-scale__sample"
                style={{ fontWeight: weight.value }}
              >
                The quick brown fox
              </span>
              <span className="weight-scale__token">
                {weight.token} · {weight.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Radii</h2>
        <ul className="swatch-scale">
          {RADII.map((radius) => (
            <li key={radius.token} className="swatch-scale__row">
              <span
                className="swatch-scale__chip swatch-scale__chip--radius"
                style={{ borderRadius: `var(${radius.token})` }}
              />
              <span className="swatch-scale__token">
                {radius.token} · {radius.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Overlay chrome</h2>
        <p className="foundations__note">
          Fixed in both themes — these sit on the Home photograph, not on the
          page background.
        </p>
        <ul className="swatch-scale">
          {OVERLAY.map((color) => (
            <li key={color.token} className="swatch-scale__row">
              <span
                className="swatch-scale__chip swatch-scale__chip--color"
                style={{ backgroundColor: `var(${color.token})` }}
              />
              <span className="swatch-scale__token">
                {color.token} · {color.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="foundations__section">
        <h2 className="foundations__section-title">Spacing scale</h2>
        <ul className="space-scale">
          {SPACE_SCALE.map((step) => (
            <li key={step.token} className="space-scale__row">
              <span className="space-scale__token">
                {step.token} · {step.px}px
              </span>
              <span
                className="space-scale__bar"
                style={{ width: `var(${step.token})` }}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Foundations
