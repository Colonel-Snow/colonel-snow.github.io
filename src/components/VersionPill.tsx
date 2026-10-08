import './VersionPill.css'

interface VersionPillProps {
  /* The cuts the current page has. Rendered in the order given. */
  versions: string[]
  active: string
  onChange: (version: string) => void
}

/*
  Switches between versions of the page being looked at, and nothing else.
  It is deliberately not a nav: it never names a page, and App only mounts
  it when the page on screen actually has more than one cut, so it is absent
  rather than empty everywhere else.
*/
function VersionPill({ versions, active, onChange }: VersionPillProps) {
  return (
    <div className="version-pill" role="group" aria-label="Page version">
      {versions.map((version) => (
        <button
          key={version}
          type="button"
          className="version-pill__option"
          data-active={version === active}
          aria-pressed={version === active}
          aria-label={`Version ${version}`}
          onClick={() => onChange(version)}
        >
          {version}
        </button>
      ))}
    </div>
  )
}

export default VersionPill
