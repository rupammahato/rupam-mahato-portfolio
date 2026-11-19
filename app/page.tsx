'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SiteHeader from '@/components/site-header'
import HeroVisual from '@/components/hero-visual'
import ProjectCard from '@/components/project-card'
import ExperienceList from '@/components/experience-list'
import StackGroups from '@/components/stack-groups'
import { awards, contact, education, projects, proof, services, updated } from '@/lib/site-data'

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

export default function Page() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>

    <section id="top" className="hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Backend Engineer, AI Systems / Kharagpur, IN</p>
        <h1>Designing <em>systems</em> that hold their shape.</h1>
        <p className="hero-intro">I&apos;m Rupam Mahato, a backend and AI-systems engineer at IIT Kharagpur (graduating May 2027). I build multi-tenant RAG platforms, replay-safe payment flows and consistent-hashing load balancing.</p>
        <div className="hero-actions"><a className="btn btn-primary" href="#work">Explore selected work <ArrowUpRight size={16} aria-hidden="true" /></a><a className="btn btn-ghost" href={contact.resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={15} aria-hidden="true" /></a><a className="link-under" href={`mailto:${contact.email}`}>Email me <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        <p className="availability"><i className="dot" aria-hidden="true" /><span>Open to full-time backend & AI roles · Freelance & contract available</span></p>
      </div>
      <HeroVisual />
    </div></section>

    <section className="proof" aria-label="Highlights"><dl className="wrap proof-grid">{proof.map(p => <div key={p.value}><dt>{p.label}</dt><dd>{p.value}</dd></div>)}</dl></section>

    <section id="work" className="section"><div className="wrap">
      <SectionLabel number="01">Selected work</SectionLabel>
      <div className="section-head"><h2>Useful complexity, <em>carefully arranged.</em></h2><p>Projects that make invisible infrastructure feel legible, dependable, and a little more human.</p></div>
      <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div>
    </div></section>

    <section id="services" className="section"><div className="wrap">
      <SectionLabel number="02">Services</SectionLabel>
      <div className="section-head"><h2>Ways to <em>work together.</em></h2><p>Available for full-time roles and scoped freelance or contract engagements.</p></div>
      <ol className="services-grid">{services.map((service, index) => <li className="service-row" key={service.title}><span className="service-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{service.title}</h3><p>{service.description}</p></div></li>)}</ol>
    </div></section>

    <section id="about" className="section section-alt"><div className="wrap">
      <SectionLabel number="03">Background</SectionLabel>
      <div className="about-intro">
          <h2>Good systems leave room for <em>good questions.</em></h2>
          <p className="about-lede">I&apos;m a dual-degree student at IIT Kharagpur building backend systems and AI pipelines — from multi-tenant RAG platforms to payment rails and payroll SLA engines. I care about clear boundaries, resilient defaults, and shipping things that work under real load.</p>
      </div>
      <div className="about-grid">
        <div className="background-facts">
          <div className="education-block"><h3 className="background-title">Education</h3><p className="edu-school">{education.school}</p><p className="edu-degree">{education.degree}</p><p className="edu-period">{education.period}</p></div>
          <div><h3 className="background-title">Leadership &amp; awards</h3><ul className="awards">{awards.map(([name, detail]) => <li key={name}><strong>{name}</strong><span>{detail}</span></li>)}</ul></div>
        </div>
        <div><h3 className="background-title">Experience</h3><ExperienceList /></div>
      </div>
    </div></section>

    <section id="stack" className="section"><div className="wrap">
      <SectionLabel number="04">Stack / thinking tools</SectionLabel>
      <div className="section-head"><h2>Tools are <em>choices.</em></h2><p>A small, opinionated toolkit for building things that can be understood.</p></div>
      <StackGroups />
    </div></section>

    <section id="contact" className="section contact"><div className="wrap">
      <SectionLabel number="05">Contact</SectionLabel>
      <div className="contact-grid"><div>
      <p className="eyebrow">Have a hard problem?</p>
      <h2 className="contact-title">Let&apos;s make it <em>legible.</em></h2>
      </div><div className="contact-actions">
      <p className="contact-note">Open to full-time backend/AI roles — and available for freelance or contract work.</p>
      <a className="contact-email" href={`mailto:${contact.email}`}><span>{contact.email}</span><ArrowUpRight size={20} aria-hidden="true" /></a>
      <ul className="social-links" aria-label="Profiles">{[['GitHub', contact.github], ['LinkedIn', contact.linkedin], ['Codeforces', contact.codeforces], ['LeetCode', contact.leetcode]].map(([label, url]) => <li key={label}><a href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={14} aria-hidden="true" /></a></li>)}</ul>
      </div></div>
      <footer><span>© 2026 Rupam Mahato · Updated {updated}</span><Clock /><a href="#top">Back to top ↑</a></footer>
    </div></section>
  </main></>
}
