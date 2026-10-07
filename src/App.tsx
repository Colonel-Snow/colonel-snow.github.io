import { useState } from 'react'
import TabNav, { type Tab } from './components/TabNav'
import Home from './pages/Home'
import Work from './pages/Work'
import Foundations from './pages/Foundations'
import Gallery from './pages/Gallery'
import Resume from './pages/Resume'
import './App.css'

function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <>
      <div className="app-shell">
        {tab === 'home' && <Home onNavigate={setTab} />}
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
        <TabNav active={tab} onChange={setTab} />
      </div>
    </>
  )
}

export default App
