import { useEffect, useRef, useState, type CSSProperties } from 'react'
import sunsetImg from '../assets/hero-scene-2.jpeg'
import auroraImg from '../assets/hero-aurora.jpg'
import alaskaMap from '../assets/alaska.png'
import { type Tab } from '../components/TabNav'
import './Home.css'

/*
  The two exposures this viewfinder can be set to — the site's light and dark
  modes. Each carries its own framing: `aspect` must match the file, `anchor`
  is how far down it the name sits, and `zoom`/`offsetY` place the subject.
  How the name is spaced and nudged sideways is typography, so it lives in
  Home.css keyed on the scene's id.
  `offsetY` may only pan as far as the zoom's spare height allows, or the
  photo stops covering the frame — hence the larger zoom on the night scene.
*/
const SCENES = [
  {
    id: 'day',
    label: 'Sunset',
    src: sunsetImg,
    aspect: 1215 / 864,
    anchor: '24.2%',
    zoom: 1.08,
    offsetY: '0%',
    alt: 'A figure in a fishing hat raises a hand to a gull against an orange sunset on the Kenai River.',
  },
  {
    id: 'night',
    label: 'Aurora',
    src: auroraImg,
    aspect: 1200 / 800,
    anchor: '35%',
    zoom: 1.3,
    offsetY: '-9%',
    alt: 'Three people on a frozen lake raise their arms to a green and violet aurora above a treeline.',
  },
]

/*
  The viewfinder's own menu. Items with a `tab` navigate; `Play` has nowhere
  to go yet, so it stays a label rather than a button that does nothing.
*/
const MENU: { label: string; tab?: Tab }[] = [
  { label: 'Play' },
  { label: 'Home', tab: 'home' },
  { label: 'Work', tab: 'work' },
]

const EDGES = ['top', 'right', 'bottom', 'left'] as const

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const LINKEDIN_URL = 'https://www.linkedin.com/in/kernellsnow'

/* Exposure-compensation mark, the way a camera draws it. */
function ExposureIcon() {
  return (
    <svg
      className="scene__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="2" />
      <path d="M21 3 3 21" />
      <path d="M5.5 8h4M7.5 6v4" />
      <path d="M14.5 16h4" />
    </svg>
  )
}

interface LocationCardProps {
  /* The place the pin marks, and the region whose map is shown. */
  place: string
  region: string
  map: string
  /* Where the place falls on that map, as a share of its width and height. */
  pinX: string
  pinY: string
  /* The map file's own width / height, so it is never stretched to fit. */
  mapAspect: number
  /* How far the map is enlarged, and the point held at the card's centre. */
  zoom?: number
  /* Pulled back to this while the card is hovered and the box opens up. */
  hoverZoom?: number
  focusX?: string
  focusY?: string
}

function LocationCard({
  place,
  region,
  map,
  pinX,
  pinY,
  mapAspect,
  zoom = 1,
  hoverZoom = zoom,
  focusX = '50%',
  focusY = '50%',
}: LocationCardProps) {
  return (
    <div className="scene__card scene__card--bl">
      <div
        className="scene__map"
        style={
          {
            '--map-src': `url(${map})`,
            '--map-aspect': mapAspect,
            '--map-zoom': zoom,
            '--map-zoom-out': hoverZoom,
            '--map-focus-x': focusX,
            '--map-focus-y': focusY,
          } as CSSProperties
        }
        aria-hidden="true"
      >
        {/* Pin lives inside the map's own frame so it stays put on the map. */}
        <span className="scene__map-view">
          <span className="scene__map-land" />
          <span className="scene__map-pin" style={{ left: pinX, top: pinY }} />
        </span>
        <span className="scene__map-grid" />
      </div>
      <p className="scene__card-labels">
        <span>{place}</span>
        <span>{region}</span>
      </p>
    </div>
  )
}

/* Storage card — the resume lives on it, as far as the camera is concerned. */
function SdCardIcon() {
  return (
    <svg
      className="scene__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 3h6l5 5v12a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M9 6v3M11.5 6v3M14 6.5v2.5" />
    </svg>
  )
}

/*
  LinkedIn's own mark, not a redrawn one — the solid "in" bug, filled with
  currentColor so it renders as their white-on-transparent version here.
*/
function LinkedInIcon() {
  return (
    <svg
      className="scene__icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function Credential({ org }: { org?: string }) {
  return (
    <span className="scene__credential">
      MS <span className="scene__credential-box">HCI</span>
      {org ? <span>{org}</span> : null}
    </span>
  )
}

/*
  Drifts the scene against the pointer, as though the frame were held rather
  than fixed. Deliberately outside React: this writes two custom properties
  straight onto the node on each animation frame, where routing it through
  state would re-render the page sixty times a second. The loop also parks
  itself once the motion has settled instead of spinning forever.
*/
function useHandheldDrift(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current
    if (!node) return
    // A drifting backdrop is a vestibular trigger, and touch has no pointer.
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let frame = 0

    function tick() {
      const deltaX = targetX - currentX
      const deltaY = targetY - currentY
      currentX += deltaX * 0.07
      currentY += deltaY * 0.07
      node!.style.setProperty('--pointer-x', currentX.toFixed(4))
      node!.style.setProperty('--pointer-y', currentY.toFixed(4))

      if (Math.abs(deltaX) < 0.0005 && Math.abs(deltaY) < 0.0005) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(tick)
    }

    function wake() {
      if (frame === 0) frame = requestAnimationFrame(tick)
    }

    function onPointerMove(event: PointerEvent) {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = (event.clientY / window.innerHeight) * 2 - 1
      wake()
    }

    function onPointerLeave() {
      targetX = 0
      targetY = 0
      wake()
    }

    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerleave', onPointerLeave)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [ref])
}

interface HomeProps {
  /* The viewfinder's way out to the rest of the site. */
  onNavigate: (tab: Tab) => void
  /*
    Which cut of the chrome to draw. Passed straight through to a data
    attribute and never branched on: the component does not know what a
    version means, which is what lets a new one be added in CSS alone.
  */
  version?: string
}

function Home({ onNavigate, version = '01' }: HomeProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const openedOnce = useRef(false)
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const [sceneIndex, setSceneIndex] = useState(0)

  const scene = SCENES[sceneIndex]
  const nextScene = SCENES[(sceneIndex + 1) % SCENES.length]

  useHandheldDrift(sceneRef)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  /*
    The iris opens on first paint from the class alone, so the picture is
    never shown before the blades close over it. Changing exposure has to
    re-run that same animation, and an element that has already finished one
    will not replay it just because the class is set again — the class comes
    off, a reflow is forced to flush the removal, and it goes back on.
  */
  useEffect(() => {
    if (!openedOnce.current) {
      openedOnce.current = true
      return
    }
    const node = sceneRef.current
    if (!node) return
    node.classList.remove('scene--iris')
    void node.offsetWidth
    node.classList.add('scene--iris')
  }, [sceneIndex])

  return (
    <section
      className="scene scene--iris"
      data-version={version}
      ref={sceneRef}
      data-scene={scene.id}
      style={
        {
          '--photo-aspect': scene.aspect,
          '--photo-anchor': scene.anchor,
          '--photo-zoom': scene.zoom,
          '--photo-offset-y': scene.offsetY,
        } as CSSProperties
      }
    >
      {/*
        The photo and the name share a box so the name tracks the gull at
        every viewport shape, rather than lining up at one aspect ratio only.
      */}
      <div className="scene__plate">
        <img className="scene__image" src={scene.src} alt={scene.alt} />
        <div className="scene__scrim" aria-hidden="true" />

        <header className="scene__titles">
          {/* Split so the gull flies through the gap in the name. */}
          <h1 className="scene__name">
            <span>Kernell</span>
            <span>Snow</span>
          </h1>
          <p className="scene__tagline">I am a product designer</p>
        </header>
      </div>

      <div className="scene__hud">
        <div className="scene__bracket scene__bracket--tl">
          <p className="scene__rec">
            <span className="scene__rec-dot" aria-hidden="true" />
            Rec
          </p>
          <p className="scene__timecode">{formatElapsed(now - startedAt)}</p>
        </div>

        <div className="scene__bracket scene__bracket--tr">
          <a
            className="scene__tool"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <LinkedInIcon />
          </a>
          <button
            type="button"
            className="scene__tool"
            onClick={() => onNavigate('resume')}
            aria-label="Open resume"
          >
            <SdCardIcon />
          </button>
          <button
            type="button"
            className="scene__tool scene__tool--exposure"
            onClick={() =>
              setSceneIndex((current) => (current + 1) % SCENES.length)
            }
            aria-label={`Change exposure to ${nextScene.label}`}
          >
            <ExposureIcon />
          </button>
        </div>

        <span className="scene__rule scene__rule--right" aria-hidden="true" />

        <div className="scene__frame" aria-hidden="true">
          {EDGES.map((edge) => (
            <span
              key={edge}
              className={`scene__frame-tick scene__frame-tick--${edge}`}
            />
          ))}
        </div>

        <nav className="scene__menu" aria-label="Viewfinder">
          <ul className="scene__menu-list">
            {MENU.map(({ label, tab }) => (
              <li key={label}>
                {tab ? (
                  <button
                    type="button"
                    className="scene__menu-item"
                    data-active={tab === 'home'}
                    aria-current={tab === 'home' ? 'page' : undefined}
                    onClick={() => onNavigate(tab)}
                  >
                    {label}
                  </button>
                ) : (
                  <span className="scene__menu-item" aria-hidden="true">
                    {label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <span className="scene__corner scene__corner--bl" aria-hidden="true" />
        <span className="scene__corner scene__corner--br" aria-hidden="true" />

        <LocationCard
          place="Kenai"
          region="Alaska"
          map={alaskaMap}
          mapAspect={450 / 360}
          pinX="54%"
          pinY="70%"
          zoom={2.2}
          hoverZoom={1.5}
          focusX="54%"
          focusY="66%"
        />

        <p className="scene__meta">
          <span>Product designer</span>
          <Credential org="@Gatech" />
          <span>AI researcher</span>
        </p>

        <button
          type="button"
          className="scene__card scene__card--br scene__card--button"
          onClick={() => onNavigate('work')}
        >
          <span
            className="scene__thumb scene__thumb--filled"
            aria-hidden="true"
          />
          <span className="scene__card-labels">
            <span>Work &amp;</span>
            <span>Projects</span>
          </span>
        </button>
      </div>
    </section>
  )
}

export default Home
