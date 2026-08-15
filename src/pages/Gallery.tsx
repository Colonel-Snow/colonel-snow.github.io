import './Gallery.css'

const PIECES = [
  { id: 1, seed: 'gallery-1', title: 'Untitled 1', wide: true },
  { id: 2, seed: 'gallery-2', title: 'Untitled 2', wide: false },
  { id: 3, seed: 'gallery-3', title: 'Untitled 3', wide: false },
  { id: 4, seed: 'gallery-4', title: 'Untitled 4', wide: false },
  { id: 5, seed: 'gallery-5', title: 'Untitled 5', wide: true },
  { id: 6, seed: 'gallery-6', title: 'Untitled 6', wide: false },
]

function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery__inner">
        <header className="gallery__intro">
          <p className="eyebrow">Gallery</p>
          <h1>Art</h1>
          <p className="gallery__intro-body">
            A wall of landscape paintings. Swap the placeholder images in{' '}
            <code>src/pages/Gallery.tsx</code> for your own pieces.
          </p>
        </header>

        <ul className="gallery__grid">
          {PIECES.map((piece) => (
            <li
              key={piece.id}
              className={`gallery__card${piece.wide ? ' gallery__card--wide' : ''}`}
            >
              <div className="gallery__mat">
                <img
                  className="gallery__tile-image"
                  src={`https://picsum.photos/seed/${piece.seed}/1200/800`}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="gallery__meta">
                <span className="gallery__tag">Original</span>
                <span className="gallery__caption">{piece.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Gallery
