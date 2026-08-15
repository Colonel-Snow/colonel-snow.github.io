import './Foundations.css'

const TYPE_SCALE = [
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
