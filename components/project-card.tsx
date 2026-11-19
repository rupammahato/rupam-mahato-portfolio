import { ArrowUpRight } from 'lucide-react'
import ProjectVisual from './project-visual'
import type { Project } from '@/lib/site-data'

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const titleId = `project-${project.visual}`
  return <article className="project-card" aria-labelledby={titleId}>
    <div className="project-visual">
      <ProjectVisual kind={project.visual} />
      <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </div>
    <div className="project-copy">
      <div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div>
      <h3 id={titleId}>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <dl className="project-outcome"><dt>{project.outcome.label}</dt><dd>{project.outcome.value}</dd></dl>
      <ul className="tag-row" aria-label="Technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <div className="project-links">
        {project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.linkLabel} for ${project.title}`}>{project.linkLabel} <ArrowUpRight size={15} aria-hidden="true" /></a> : <span className="link-fallback">Live demo unavailable</span>}
        {project.repo ? <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${project.title}`}>Source <ArrowUpRight size={15} aria-hidden="true" /></a> : <span className="link-fallback">Code private</span>}
      </div>
    </div>
  </article>
}
