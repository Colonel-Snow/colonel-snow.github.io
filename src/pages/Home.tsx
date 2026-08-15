import { useEffect, useState } from 'react'
import sceneImg from '../assets/hero-scene.png'
import './Home.css'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function formatClock(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function Home() {
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="scene" aria-label="Live recording of a beach sunset">
      <img className="scene__image" src={sceneImg} alt="" />

      <div className="scene__grid" aria-hidden="true">
        <span className="scene__grid-line scene__grid-line--v1" />
        <span className="scene__grid-line scene__grid-line--v2" />
        <span className="scene__grid-line scene__grid-line--h1" />
        <span className="scene__grid-line scene__grid-line--h2" />
      </div>

      <div className="scene__hud" aria-hidden="true">
        <div className="scene__hud-row scene__hud-row--top">
          <div className="scene__rec">
            <span className="scene__rec-dot" />
            REC {formatElapsed(now - startedAt)}
          </div>
          <div className="scene__status">
            <span className="scene__status-item">4K</span>
            <span className="scene__status-item scene__status-item--wide">
              AUTO
            </span>
            <span className="scene__signal">
              <span className="scene__signal-bar" style={{ height: '30%' }} />
              <span className="scene__signal-bar" style={{ height: '55%' }} />
              <span className="scene__signal-bar" style={{ height: '75%' }} />
              <span
                className="scene__signal-bar"
                style={{ height: '100%' }}
              />
            </span>
            <span className="scene__battery">
              <span className="scene__battery-fill" />
              <span className="scene__battery-tip" />
            </span>
          </div>
        </div>

        <div className="scene__focus-box">
          <span className="scene__focus-corner scene__focus-corner--tl" />
          <span className="scene__focus-corner scene__focus-corner--tr" />
          <span className="scene__focus-corner scene__focus-corner--bl" />
          <span className="scene__focus-corner scene__focus-corner--br" />
        </div>

        <div className="scene__hud-row scene__hud-row--bottom">
          <div className="scene__exposure">
            <span>24mm</span>
            <span>F/2.8</span>
            <span>1/125</span>
            <span>ISO 400</span>
          </div>
          <div className="scene__timestamp">{formatClock(new Date(now))}</div>
        </div>
      </div>
    </section>
  )
}

export default Home
