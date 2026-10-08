import { useState } from 'react'
import TabNav, { type Tab } from './components/TabNav'
import VersionPill from './components/VersionPill'
import Home from './pages/Home'
import { VERSIONS as HOME_VERSIONS } from './pages/Home.versions'
import Work from './pages/Work'
import Foundations from './pages/Foundations'
import Gallery from './pages/Gallery'
import Resume from './pages/Resume'
import './App.css'

/*
  Which pages have more than one cut of themselves. Each page exports its own
  list, so App never has to know what a version means or how many exist — it
  only routes the choice back in. Pages absent here have a single version and
  show no pill.
*/
const PAGE_VERSIONS: Partial<Record<Tab, string[]>> = {
  home: HOME_VERSIONS,
}

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [version, setVersion] = useState('01')

  const versions = PAGE_VERSIONS[tab]
  /*
    Versions are numbered per page, so a selection made on one page may not
    exist on the next. Fall back to the first rather than passing a version
    the page cannot draw.
  */
  const activeVersion =
    versions && versions.includes(version) ? version : versions?.[0] ?? '01'

  return (
    <>
      <div className="app-shell">
        {tab === 'home' && (
          <Home onNavigate={setTab} version={activeVersion} />
        )}
        {tab === 'work' && <Work />}
        {tab === 'foundations' && <Foundations />}
        {tab === 'gallery' && <Gallery />}
        {tab === 'resume' && <Resume />}
      </div>

      {/*
        Master control. A sibling of the page, never a child of it, so no
        page can capture it in a stacking context, inherit palette overrides
        onto it, or shift it by changing its own layout.
      */}
      <div className="site-controls">
        {versions && versions.length > 1 && (
          <VersionPill
            versions={versions}
            active={activeVersion}
            onChange={setVersion}
          />
        )}
        <TabNav active={tab} onChange={setTab} />
      </div>
    </>
  )
}

export default App
