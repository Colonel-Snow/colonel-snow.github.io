import { useEffect, useRef, useState } from 'react'
import './TabNav.css'

export type Tab = 'home' | 'work' | 'foundations' | 'gallery' | 'resume'

interface TabNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'foundations', label: 'Typography & Components' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'resume', label: 'Resume' },
]

function TabNav({ active, onChange }: TabNavProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="tab-nav" ref={rootRef}>
      <button
        type="button"
        className="tab-nav__toggle"
        aria-label={open ? 'Close site menu' : 'Open site menu'}
        aria-expanded={open}
        aria-controls="tab-nav-panel"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <svg
          className="tab-nav__gear"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <nav
        id="tab-nav-panel"
        className="tab-nav__panel"
        aria-label="Site sections"
        hidden={!open}
      >
        <ul className="tab-nav__list">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className="tab-nav__button"
                data-active={tab.id === active}
                onClick={() => {
                  onChange(tab.id)
                  setOpen(false)
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default TabNav
