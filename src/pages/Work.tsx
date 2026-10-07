import './Work.css'

interface Project {
  id: string
  title: string
  role: string
  year: string
  summary: string
  tags: string[]
}

/*
  Content slots, not finished copy — the shape is right, the words are yours
  to replace. Edits here are data edits, the same as EXPERIENCE in Resume.
*/
const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'Name of the project',
    role: 'Product design · Research',
    year: '2026',
    summary:
      'Two or three sentences: the problem, what you designed, and what changed because of it. Lead with the outcome if you have a number for it.',
    tags: ['Design system', 'Prototyping'],
  },
  {
    id: 'project-02',
    title: 'Name of the project',
    role: 'Product design',
    year: '2025',
    summary:
      'Say who it was for and what constraint made it hard. One line on the approach is enough — the case study can carry the rest.',
    tags: ['User research', 'Interaction'],
  },
  {
    id: 'project-03',
    title: 'Name of the project',
    role: 'Design · Front-end',
    year: '2025',
    summary:
      'A shorter entry works here. Keep the strongest three at the top; this page is a reel, not an archive.',
    tags: ['Interface', 'Motion'],
  },
]

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const

function Work() {
  return (
    <main className="work">
      <header className="work__intro">
        <p className="eyebrow">Selected work</p>
        <h1>Featured projects</h1>
        <p className="work__intro-body">
          A short reel of the work I keep coming back to — what the problem
          was, what I made, and what it changed.
        </p>
      </header>

      <ol className="work__list">
        {PROJECTS.map((project, index) => (
          <li key={project.id} className="work__item">
            <div className="work__frame">
              {CORNERS.map((corner) => (
                <span
                  key={corner}
                  className={`work__frame-corner work__frame-corner--${corner}`}
                  aria-hidden="true"
                />
              ))}
              <span className="work__index">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="work__body">
              <p className="work__meta">
                <span>{project.role}</span>
                <span>{project.year}</span>
              </p>
              <h2 className="work__title">{project.title}</h2>
              <p className="work__summary">{project.summary}</p>
              <ul className="work__tags">
                {project.tags.map((tag) => (
                  <li key={tag} className="work__tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default Work
