import { skillCategories } from '@/lib/site-data'

export default function StackGroups() {
  return <div className="stack-groups">{Object.entries(skillCategories).map(([category, tools]) =>
    <div className="stack-group" key={category}>
      <h3>{category}</h3>
      <ul className="skill-list" aria-label={`${category} tools`}>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
    </div>
  )}</div>
}
