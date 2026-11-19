import { ChevronDown } from 'lucide-react'
import { experience } from '@/lib/site-data'

export default function ExperienceList() {
  return <div className="experience-list">{experience.map(([role, organisation, period, summary], index) =>
    <details className="experience-row" name="experience" open={index === 0} key={organisation}>
      <summary>
        <span className="experience-heading"><span className="experience-year">{period}</span><strong>{role}</strong><span className="experience-org">{organisation}</span></span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <p>{summary}</p>
    </details>
  )}</div>
}
