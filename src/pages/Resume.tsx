import './Resume.css'

const EXPERIENCE = [
  {
    role: 'Graduate Researcher',
    org: 'AI CARING',
    location: 'Atlanta, GA',
    dates: 'May 2026 – Present',
    bullets: [
      'Manage a portfolio of 13 sensor-enabled AI research homes, deploying 5 new installations within 2 months to support long-term non-clinical studies for seniors aging in place.',
      'Created and maintained troubleshooting documentation, decision trees, and deployment guides for sensor and Pi kit setups, streamlining issue resolution and on-boarding across the research team.',
      'Sped up deployment processes, cutting sensor kit preparation and installation time from 3 hours to 1.5 hours.',
      'Updated a legacy CLI program used for data validation, replacing it with a simplified, task-driven interface informed by contextual research with the deployment team.',
    ],
  },
  {
    role: 'Product Design Intern',
    org: 'ConstructConnect',
    location: 'Atlanta, GA',
    dates: 'May 2026 – Aug. 2026',
    bullets: [
      "Redesigned the User Management Portal's Role assignment flows, unifying 5 disparate permission models and fragmented display patterns (checkboxes, dropdowns, tier selections) into a single toggle-based, group-driven access system.",
      'Validated designs through 2 rounds of think-aloud usability testing (10 participants + 2 pilot per round), uncovering the permission model as the root cause of user confusion, not the UI.',
      'Secured cross-functional buy-in from Product, PM, and Engineering to advance the redesign into feasibility testing, with implementation planned for Q4.',
    ],
  },
  {
    role: 'Product Designer',
    org: 'Georgia Aquarium (Sponsored Project)',
    location: 'Atlanta, GA',
    dates: 'Aug. 2025 – Dec. 2025',
    bullets: [
      "Designed and iteratively prototyped 3 immersive treehouse themed children's exhibit within a 12ft diameter footprint, evaluating 5 prototypes through iterative user testing with 26 children.",
      "Conducted mixed-methods research and co-design sessions with 42 children to uncover how they learn and engage in play spaces, informing the exhibit's interaction design.",
      'Delivered final prototypes and design recommendations that became the conceptual foundation for the exhibit, now in active development for construction to serve 8,000–10,000 daily visitors.',
    ],
  },
  {
    role: 'UX Designer',
    org: 'University of Alaska, Fairbanks',
    location: 'Fairbanks, AK',
    dates: 'Aug. 2019 – Jun. 2025',
    bullets: [
      'Led end-to-end UX redesigns across the college application portal and 100+ eCampus pages, serving 21,000+ students and faculty, driving a 43% increase in completed applications and 33% more web sessions.',
      'Designed a 22-component design system for the college portal redesign, consolidating components into 2 standardized templates and removing unnecessary cross-team dependencies.',
      'Launched a new CRM system and optimized critical user journeys, reducing application processing time by 20% and streamlining student communication workflows by 15%.',
    ],
  },
]

const EDUCATION = [
  {
    school: 'Georgia Institute of Technology',
    degree: 'Master of Science in Human Computer Interaction',
    dates: 'Aug. 2025 – May 2027',
  },
  {
    school: 'University of Alaska, Fairbanks',
    degree: 'Bachelor of Science in Computer Science, Minor in Mathematics',
    dates: 'Aug. 2017 – May 2021',
  },
]

const SKILLS = [
  {
    label: 'Design',
    value:
      'UX Design, UI Design, Interaction Design, Information Architecture (IA), Wireframing, Prototyping, AI Assisted Prototyping, Design Systems, Accessible Design, Data-Driven UX, Front-End Implementation',
  },
  {
    label: 'Research',
    value:
      'User Research, Usability Testing, Mixed-Methods Research, Moderated Usability Testing, Co-Design, Participatory Design, Ethnographic Methods, Tree Testing',
  },
  {
    label: 'Tools',
    value: 'Figma, FigJam, Miro, UserTesting, Adobe Creative Suite, Claude, Cursor, Lovable, React/Next.js',
  },
]

function Resume() {
  return (
    <main className="resume">
      <header className="resume__header">
        <div>
          <p className="eyebrow">Resume</p>
          <h1>Kernell Snow</h1>
          <p className="resume__title">Product Designer</p>
        </div>
        <ul className="resume__contact">
          <li>
            <a href="https://ksnow.framer.website/" target="_blank" rel="noreferrer">
              ksnow.framer.website
            </a>
          </li>
          <li>
            <a href="mailto:kernellsnow@gmail.com">kernellsnow@gmail.com</a>
          </li>
          <li>
            <a href="tel:+19073439951">(907) 343-9951</a>
          </li>
          <li>Atlanta, Georgia</li>
        </ul>
        <a className="resume__download" href="/resume/resume.tex" download>
          Download source (.tex)
        </a>
      </header>

      <section className="resume__section">
        <h2 className="resume__section-title">Experience</h2>
        <ul className="resume__list">
          {EXPERIENCE.map((job) => (
            <li key={job.role + job.org} className="resume__entry">
              <div className="resume__entry-head">
                <h3>{job.role}</h3>
                <span className="resume__dates">{job.dates}</span>
              </div>
              <div className="resume__entry-subhead">
                <span className="resume__org">{job.org}</span>
                <span className="resume__location">{job.location}</span>
              </div>
              <ul className="resume__bullets">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Education</h2>
        <ul className="resume__list">
          {EDUCATION.map((school) => (
            <li key={school.school} className="resume__entry">
              <div className="resume__entry-head">
                <h3>{school.school}</h3>
                <span className="resume__dates">{school.dates}</span>
              </div>
              <div className="resume__entry-subhead">
                <span className="resume__org">{school.degree}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Skills</h2>
        <ul className="resume__skills">
          {SKILLS.map((skill) => (
            <li key={skill.label}>
              <span className="resume__skills-label">{skill.label}</span>
              <span className="resume__skills-value">{skill.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Resume
