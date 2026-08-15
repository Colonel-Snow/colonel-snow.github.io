import './TabNav.css'

export type Tab = 'home' | 'foundations' | 'gallery'

interface TabNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'foundations', label: 'Typography & Components' },
  { id: 'gallery', label: 'Gallery' },
]

function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="tab-nav" aria-label="Site sections">
      <ul className="tab-nav__list">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className="tab-nav__button"
              data-active={tab.id === active}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TabNav
