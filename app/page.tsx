'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, Download, Menu, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const ServiceMesh = dynamic(() => import('@/components/service-mesh'), { ssr: false })
const ProjectScene = dynamic(() => import('@/components/project-scene'), { ssr: false })
const StackOrbit = dynamic(() => import('@/components/stack-orbit'), { ssr: false })
const SceneView = dynamic(() => import('@/components/scene-view'), { ssr: false })
const SceneCanvas = dynamic(() => import('@/components/scene-canvas'), { ssr: false })

const nav = ['Work', 'Services', 'About', 'Stack', 'Contact']
const skillCategories: Record<string, string[]> = {
  Backend: ['Python', 'Django', 'FastAPI', 'Node.js', 'Express.js', 'PostgreSQL'],
  Frontend: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  'AI/ML': ['LangChain', 'LangGraph', 'Pinecone', 'RAG'],
  Cloud: ['MongoDB', 'AWS', 'Docker', 'DigitalOcean'],
}
const skills = Object.values(skillCategories).flat()
const education = { school: 'Indian Institute of Technology Kharagpur', degree: 'Dual Degree — B.Tech. Civil Engineering & M.Tech. Environmental Engineering & Management', period: 'Nov 2022 — May 2027' }
const awards = [
  ['IIT Bombay Action Plan 2024', 'Finalist — pitched a sustainable business model to industry investors'],
  ['Smart India Hackathon 2023', 'Top Team Selection — architected a scalable, complex solution'],
  ['Hero CoLabs Design Challenge 5.0', '2nd Runner-Up — high-fidelity prototypes delivered with precision'],
]
const projects = [
  { title: 'Megalith 2025', type: 'Event platform', year: '2025', tags: ['Next.js', 'TypeScript', 'JWT'], description: "A Next.js event site for IIT Kharagpur's civil engineering fest — JWT auth with refresh-token rotation and an admin analytics dashboard serving 5K+ concurrent users at sub-2s loads.", scene: 'ledger' as const, link: 'https://megalith.co.in/', linkLabel: 'Visit site' },
  { title: 'Membition', type: 'RAG platform', year: '2024', tags: ['Flask', 'Python', 'Pinecone'], description: "A multi-tenant RAG chatbot platform for NGOs, so each organization's knowledge base stays fully isolated from every other tenant's — built on a Pinecone index-per-tenant boundary, hardened PDF ingestion, and a scope-constrained system prompt.", scene: 'mesh' as const, link: undefined, linkLabel: undefined },
  { title: 'Prompts Saver', type: 'Full-stack app', year: '2024', tags: ['Next.js', 'TypeScript', 'MongoDB'], description: 'A full-stack app for saving and discovering prompts, with Google OAuth sign-in and tag-indexed MongoDB search returning results in under 100ms.', scene: 'signal' as const, link: undefined, linkLabel: undefined },
]
const services = [
  { title: 'Backend APIs & systems', description: 'REST/Express and FastAPI services — auth flows, rate-limited third-party integrations, and payroll/payment API integrations (HMRC RTI, Razorpay) built to survive real load.' },
  { title: 'AI & RAG pipelines', description: 'Retrieval-augmented pipelines and LLM integrations — multi-tenant knowledge bases, document ingestion, and multi-provider agent orchestration.' },
  { title: 'Cloud & infrastructure', description: 'Session/auth infrastructure across origins, Docker/AWS deployment, and cost-metered usage tracking across cloud and LLM providers.' },
  { title: 'Full-stack MVPs', description: 'End-to-end products, schema to UI, for founders who need a working system fast — as sole engineer or embedded in a small team.' },
]
const experience = [
  ['Full Stack Developer Intern', 'Neosophical Labs · Goa, India', 'May 2026 — Jul 2026', "Shipped a Telegram bot orchestrating AI marketing agents across GA4, Google Ads & Meta, built a LangChain ingestion pipeline unifying Excel/XML/PDF data, and architected a UK payroll engine integrating HMRC's RTI API for PAYE, NI & pensions."],
  ['Full Stack Developer', 'Datsol Solutions | Posterity Consulting · Remote', 'Nov 2025 — May 2026', 'Built a token-gated assessment flow across a 203-endpoint Express/MongoDB app, fixed a sync crash from blank-timestamp collisions, and hardened sheet ingestion against timezone and subdocument data loss.'],
  ['Backend Engineering Intern', '10X Analysts · Remote', 'May 2025 — Jul 2025', 'Rebuilt cross-service session auth after cookies broke across origins, designed a multi-tenant authorization model for shared knowledge bases, and built a BFF proxy layer fronting a 42-route FastAPI service.'],
  ['Founder & Sole Engineer', 'Zyke — AI Social Media Content Platform · Remote', 'Oct 2024 — Jan 2025', 'Metered per-request AI spend across 7 LLM/image providers, hardened Razorpay checkout with HMAC webhook verification and idempotent credit deduction, and built an async onboarding crawler with bounded concurrency.'],
]

function SectionLabel({ number, children, dark = false }: { number: string; children: React.ReactNode; dark?: boolean }) {
  return <div className={`section-label ${dark ? 'section-label-dark' : ''}`}><span>{number}</span><span>{children}</span></div>
}

function SkillRing({ filter }: { filter: string }) {
  const shown = filter === 'All' ? skills : skillCategories[filter]
  const crowded = shown.length > 10
  const [radiusX, radiusY] = crowded ? [34, 32] : [24, 26]
  return <div className="skill-ring">{shown.map((skill, i) => {
    const a = i / Math.max(shown.length, 1) * Math.PI * 2
    return <span key={skill} className="skill-label" style={{ left: `${(50 + Math.cos(a) * radiusX).toFixed(2)}%`, top: `${(50 + Math.sin(a) * radiusY).toFixed(2)}%`, fontSize: crowded ? '12px' : undefined, color: filter !== 'All' ? '#f24822' : undefined }}>{skill}</span>
  })}</div>
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return <motion.article className="project-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * .08 }}>
    <div className="project-visual"><SceneView style={{ width: '100%', height: '100%' }}><ProjectScene kind={project.scene} /></SceneView><span className="project-index">0{index + 1}</span></div>
    <div className="project-copy"><div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.linkLabel} for ${project.title}`}>{project.linkLabel} <ArrowUpRight size={16} /></a> : <span className="project-link-fallback">Code private</span>}</div>
  </motion.article>
}

export default function Page() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('Work')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openExperience, setOpenExperience] = useState(0)
  const [filter, setFilter] = useState('All')
  const [time, setTime] = useState('—')
  const filters = ['All', ...Object.keys(skillCategories)]
  const filteredProjects = useMemo(() => filter === 'All' ? projects : projects.filter(project => project.tags.some(tag => skillCategories[filter].includes(tag))), [filter])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const match = nav.find(item => item.toLowerCase() === entry.target.id)
      if (match) setActive(match)
    }), { rootMargin: '-35% 0px -55% 0px' })
    nav.forEach(item => { const el = document.getElementById(item.toLowerCase()); if (el) observer.observe(el) })
    const clock = window.setInterval(() => setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())), 1000)
    return () => { observer.disconnect(); window.clearInterval(clock) }
  }, [])

  const goTo = (item: string) => { document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); setMenuOpen(false) }
  return <main>
    <SceneCanvas />
    <header className="site-header"><a className="monogram" href="#top" aria-label="Rupam Mahato home">RM<span>.</span></a><nav className={menuOpen ? 'nav-open' : ''}>{nav.map(item => <button key={item} className={active === item ? 'active' : ''} onClick={() => goTo(item)}>{item}</button>)}<a className="resume-link" href="/rupam-mahato-resume.pdf" download>Résumé <Download size={14} /></a></nav><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button></header>
    <section id="top" className="hero"><div className="hero-content"><p className="eyebrow">Backend Engineer, AI Systems / Kharagpur, IN</p><h1>Designing <em>systems</em><br />that hold their shape.</h1><p className="hero-intro">I&apos;m Rupam Mahato — a backend engineer building AI-powered systems, RAG pipelines, and cloud infrastructure, currently pursuing a dual degree at IIT Kharagpur.</p><div className="hero-actions"><button className="button-primary" onClick={() => goTo('Work')}>Explore selected work <ArrowUpRight size={17} /></button><span className="availability"><i /> Open to backend & AI roles · Graduating May 2027</span></div></div><div className="hero-scene"><SceneView style={{ width: '100%', height: '100%' }}><ServiceMesh /></SceneView><div className="scene-caption"><span>LIVE SERVICE MESH</span><span>p99 <strong>42ms</strong> · {time} IST</span></div></div><div className="scroll-cue">Scroll to trace the system <span>↓</span></div></section>
    <section id="work" className="work-section section-shell"><SectionLabel number="01" >Selected work</SectionLabel>{filter !== 'All' && <button className="filter-chip" onClick={() => setFilter('All')}>Filtered by {filter} <X size={12} /></button>}<div className="section-heading"><h2>Useful complexity,<br /><em>carefully arranged.</em></h2><p>Projects that make invisible infrastructure feel legible, dependable, and a little more human.</p></div><div className="projects-grid">{filteredProjects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div></section>
    <section id="services" className="services-section section-shell"><SectionLabel number="02">Services</SectionLabel><div className="section-heading"><h2>Ways to<br /><em>work together.</em></h2><p>Available for full-time roles and scoped freelance or contract engagements.</p></div><div className="services-grid">{services.map(service => <div className="service-card" key={service.title}><h3>{service.title}</h3><p>{service.description}</p></div>)}</div></section>
    <section id="about" className="about-section carbon"><div className="section-shell"><SectionLabel number="03" dark>Background</SectionLabel><div className="about-grid"><div><h2>Good systems<br />leave room for<br /><em>good questions.</em></h2><p className="about-lede">I&apos;m a dual-degree student at IIT Kharagpur building backend systems and AI pipelines — from RAG platforms to payroll engines integrated with government APIs. I care about clear boundaries, resilient defaults, and shipping things that work under real load.</p><div className="education-block"><span className="edu-school">{education.school}</span><span className="edu-degree">{education.degree}</span><span className="edu-period">{education.period}</span></div><div className="awards-block"><span className="awards-title">Awards</span><ul>{awards.map(([name, detail]) => <li key={name}><strong>{name}</strong><span>{detail}</span></li>)}</ul></div></div><div className="experience-list">{experience.map((item, index) => <div className={`experience-row ${openExperience === index ? 'is-open' : ''}`} key={item[0]}><button onClick={() => setOpenExperience(openExperience === index ? -1 : index)} aria-expanded={openExperience === index}><span className="experience-year">{item[2]}</span><span><strong>{item[0]}</strong><small>{item[1]}</small></span><ChevronDown /></button>{openExperience === index && <p>{item[3]}</p>}</div>)}</div></div></div></section>
    <section id="stack" className="stack-section section-shell"><SectionLabel number="04">Stack / thinking tools</SectionLabel><div className="stack-head"><h2>Tools are<br /><em>choices.</em></h2><div className="filter-row" role="group" aria-label="Filter skills">{filters.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="stack-visual"><SceneView style={{ width: '100%', height: '100%' }}><StackOrbit /></SceneView><SkillRing filter={filter} /><div className="stack-note">{filter === 'All' ? 'A small, opinionated toolkit for building things that can be understood.' : `The ${filter.toLowerCase()} tools I reach for most.`}</div></div></section>
    <section id="contact" className="contact-section carbon"><div className="section-shell"><SectionLabel number="05" dark>Contact</SectionLabel><div className="contact-main"><p className="eyebrow">Have a hard problem?</p><h2>Let&apos;s make it<br /><em>legible.</em></h2><p className="contact-note">Open to full-time backend/AI roles — and available for freelance or contract work.</p><a className="contact-email" href="mailto:rupammahato593@gmail.com">rupammahato593@gmail.com <ArrowUpRight /></a><div className="social-links"><a href="https://github.com/rupammahato" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://linkedin.com/in/rupammahato" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div><footer><span>© 2026 Rupam Mahato</span><span>Built with intent in Kharagpur</span><a href="#top">Back to top ↑</a></footer></div></section>
  </main>
}
