'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Download, Menu, X } from 'lucide-react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import CommandPalette from '@/components/command-palette'
import HashRingSim from '@/components/hash-ring-sim'
import ProjectVisual from '@/components/project-visual'
import { awards, contact, education, experience, projects, proof, services, skillCategories, skills, updated, type Project } from '@/lib/site-data'

const StackOrbit = dynamic(() => import('@/components/stack-orbit'), { ssr: false })
const SceneView = dynamic(() => import('@/components/scene-view'), { ssr: false })
const SceneCanvas = dynamic(() => import('@/components/scene-canvas'), { ssr: false })

const nav = ['Work', 'Services', 'About', 'Stack', 'Contact']

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="label section-label"><span className="num">{number}</span>{children}</div>
}

// Own component so the once-a-second tick re-renders only this span, not the whole page.
function Clock() {
  const [time, setTime] = useState('—')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span>Kharagpur · {time} IST</span>
}

function SkillRing({ filter }: { filter: string }) {
  const shown = filter === 'All' ? skills : skillCategories[filter]
  const crowded = shown.length > 10
  const [radiusX, radiusY] = crowded ? [34, 32] : [24, 26]
  return <div className="skill-ring">{shown.map((skill, i) => {
    const a = i / Math.max(shown.length, 1) * Math.PI * 2
    return <span key={skill} className={`skill-label ${filter !== 'All' ? 'is-filtered' : ''}`} style={{ left: `${(50 + Math.cos(a) * radiusX).toFixed(2)}%`, top: `${(50 + Math.sin(a) * radiusY).toFixed(2)}%`, fontSize: crowded ? '13px' : undefined }}>{skill}</span>
  })}</div>
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <motion.article className="card spot" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * .08 }}>
    <div className="project-visual"><ProjectVisual kind={project.visual} /><span className="project-index">0{index + 1}</span></div>
    <div className="project-copy"><div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links">{project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.linkLabel} for ${project.title}`}>{project.linkLabel} <ArrowUpRight size={15} /></a> : <span className="link-fallback">Live demo unavailable</span>}{project.repo ? <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${project.title}`}>Source <ArrowUpRight size={15} /></a> : <span className="link-fallback">Code private</span>}</div></div>
  </motion.article>
}

export default function Page() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openExperience, setOpenExperience] = useState(0)
  const [filter, setFilter] = useState('All')
  const filters = ['All', ...Object.keys(skillCategories)]

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const match = nav.find(item => item.toLowerCase() === entry.target.id)
      if (match) setActive(match)
    }), { rootMargin: '-35% 0px -55% 0px' })
    nav.forEach(item => { const el = document.getElementById(item.toLowerCase()); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // Card spotlight: one delegated listener sets --mx/--my on the hovered .spot element. Skipped on touch and under reduced motion.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>('.spot')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  const goTo = (item: string) => { document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); setMenuOpen(false) }
  return <MotionConfig reducedMotion="user"><main>
    <SceneCanvas />
    <header className="site-header"><div className="wrap header-inner">
      <a className="monogram" href="#top" aria-label="Rupam Mahato home">RM<span>.</span></a>
      <nav className={menuOpen ? 'nav-open' : ''} aria-label="Primary">{nav.map(item => <button key={item} className={active === item ? 'active' : ''} onClick={() => goTo(item)}>{item}</button>)}</nav>
      <div className="header-tools"><CommandPalette go={goTo} /><a className="btn btn-sm btn-ghost header-resume" href="/rupam-mahato-resume.pdf" download>Résumé <Download size={14} /></a><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </div></header>

    <section id="top" className="hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><i className="dot" /> Backend Engineer, AI Systems / Kharagpur, IN</p>
        <h1>Designing <em>systems</em> that hold their shape.</h1>
        <p className="hero-intro">I&apos;m Rupam Mahato, a backend and AI-systems engineer at IIT Kharagpur (graduating May 2027). I build multi-tenant RAG platforms, replay-safe payment flows and consistent-hashing load balancing.</p>
        <div className="hero-actions"><button className="btn btn-primary" onClick={() => goTo('Work')}>Explore selected work <ArrowUpRight size={16} /></button><a className="btn btn-ghost" href="/rupam-mahato-resume.pdf" download>Résumé <Download size={15} /></a><a className="link-under" href={`mailto:${contact.email}`}>Email me <ArrowUpRight size={14} /></a></div>
        <p className="availability">Open to full-time backend & AI roles · Freelance & contract available</p>
      </div>
      <HashRingSim />
    </div></section>

    <section className="proof" aria-label="Highlights"><div className="wrap proof-grid">{proof.map(p => <div key={p.value}><b>{p.value}</b><span>{p.label}</span></div>)}</div></section>

    <section id="work" className="section"><div className="wrap">
      <SectionLabel number="01">Selected work</SectionLabel>
      <div className="section-head"><h2>Useful complexity, <em>carefully arranged.</em></h2><p>Projects that make invisible infrastructure feel legible, dependable, and a little more human.</p></div>
      <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div>
    </div></section>

    <section id="services" className="section"><div className="wrap">
      <SectionLabel number="02">Services</SectionLabel>
      <div className="section-head"><h2>Ways to <em>work together.</em></h2><p>Available for full-time roles and scoped freelance or contract engagements.</p></div>
      <div className="services-grid">{services.map(service => <div className="service-card spot" key={service.title}><h3>{service.title}</h3><p>{service.description}</p></div>)}</div>
    </div></section>

    <section id="about" className="section section-alt"><div className="wrap">
      <SectionLabel number="03">Background</SectionLabel>
      <div className="about-grid">
        <div>
          <h2>Good systems leave room for <em>good questions.</em></h2>
          <p className="about-lede">I&apos;m a dual-degree student at IIT Kharagpur building backend systems and AI pipelines — from multi-tenant RAG platforms to payment rails and payroll SLA engines. I care about clear boundaries, resilient defaults, and shipping things that work under real load.</p>
          <div className="side-block"><span className="edu-school">{education.school}</span><span className="edu-degree">{education.degree}</span><span className="label">{education.period}</span></div>
          <div className="side-block"><span className="label">Leadership &amp; awards</span><ul className="awards">{awards.map(([name, detail]) => <li key={name}><strong>{name}</strong><span>{detail}</span></li>)}</ul></div>
        </div>
        <div className="experience-list">{experience.map((item, index) => <div className={`experience-row ${openExperience === index ? 'is-open' : ''}`} key={item[0]}><button onClick={() => setOpenExperience(openExperience === index ? -1 : index)} aria-expanded={openExperience === index}><span className="experience-year">{item[2]}</span><span><strong>{item[0]}</strong><small>{item[1]}</small></span><ChevronDown size={18} /></button>{openExperience === index && <p>{item[3]}</p>}</div>)}</div>
      </div>
    </div></section>

    <section id="stack" className="section"><div className="wrap">
      <SectionLabel number="04">Stack / thinking tools</SectionLabel>
      <div className="section-head"><h2>Tools are <em>choices.</em></h2><div className="filter-row" role="group" aria-label="Filter skills">{filters.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></div>
      <div className="stack-visual"><SceneView style={{ width: '100%', height: '100%' }}><StackOrbit /></SceneView><SkillRing filter={filter} /><div className="stack-note">{filter === 'All' ? 'A small, opinionated toolkit for building things that can be understood.' : `The ${filter.toLowerCase()} tools I reach for most.`}</div></div>
    </div></section>

    <section id="contact" className="section contact"><div className="wrap">
      <SectionLabel number="05">Contact</SectionLabel>
      <p className="eyebrow">Have a hard problem?</p>
      <h2 className="contact-title">Let&apos;s make it <em>legible.</em></h2>
      <p className="contact-note">Open to full-time backend/AI roles — and available for freelance or contract work.</p>
      <a className="contact-email" href={`mailto:${contact.email}`}>{contact.email} <ArrowUpRight /></a>
      <div className="social-links">{[['GitHub', contact.github], ['LinkedIn', contact.linkedin], ['Codeforces', contact.codeforces], ['LeetCode', contact.leetcode]].map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={14} /></a>)}</div>
      <footer><span>© 2026 Rupam Mahato · Updated {updated}</span><Clock /><a href="#top">Back to top ↑</a></footer>
    </div></section>
  </main></MotionConfig>
}
