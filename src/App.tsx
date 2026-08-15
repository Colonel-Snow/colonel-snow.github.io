import { useState } from 'react'
import TabNav, { type Tab } from './components/TabNav'
import Home from './pages/Home'
import Foundations from './pages/Foundations'
import Gallery from './pages/Gallery'
import './App.css'

function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="app-shell">
      <TabNav active={tab} onChange={setTab} />
      {tab === 'home' && <Home />}
      {tab === 'foundations' && <Foundations />}
      {tab === 'gallery' && <Gallery />}
    </div>
  )
}

export default App
