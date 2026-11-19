'use client'

import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import HeroVisual from '@/components/hero-visual'
import ProjectVisual from '@/components/project-visual'
import CommandPalette from '@/components/command-palette'
import { contact, projects } from '@/lib/site-data'
import styles from './preview.module.css'

export default function DesignPreview() {
  return <main className={`wrap ${styles.preview}`}>
    <header className={styles.header}>
      <a href="/" className="monogram" aria-label="Rupam Mahato portfolio">RM<span>.</span></a>
      <span className={styles.phase}>Component study / Phase 02</span>
      <CommandPalette go={section => window.location.assign(`/#${section.toLowerCase()}`)} />
    </header>
    <section className={styles.hero} aria-labelledby="preview-title">
      <div>
        <p className="eyebrow">Backend Engineer, AI Systems / Kharagpur, IN</p>
        <h1 id="preview-title" className={styles.title}>Designing <em>systems</em> that hold their shape.</h1>
        <p className={styles.intro}>I&apos;m Rupam Mahato, a backend and AI-systems engineer at IIT Kharagpur (graduating May 2027). I build multi-tenant RAG platforms, replay-safe payment flows and consistent-hashing load balancing.</p>
        <div className={styles.actions}><a className="btn btn-primary" href="#component-projects">Explore selected work <ArrowUpRight size={16} aria-hidden="true" /></a><a className="btn btn-ghost" href={contact.resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={15} aria-hidden="true" /></a></div>
        <p className={styles.note}>Original geometry. Illustrative signals. Existing portfolio content.</p>
      </div>
      <HeroVisual />
    </section>
    <section id="component-projects" className={styles.work} aria-labelledby="diagrams-title">
      <div className={styles.sectionHead}><div><p className="label"><span className="num">02 /</span> Static project illustrations</p><h2 id="diagrams-title">The same language, <em>less motion.</em></h2></div><p>Original diagrams using the same colors and geometry as the hero. These remain still.</p></div>
      <div className={styles.projects}>{projects.map(project => <article key={project.title} className={styles.project}>
        <div className={styles.diagram}><ProjectVisual kind={project.visual} /></div>
        <div className={styles.projectCopy}><div className={styles.projectMeta}><span>{project.type}</span><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      </article>)}</div>
    </section>
    <div className={styles.footer}><a href="/"><ArrowLeft size={14} aria-hidden="true" /> Back to portfolio</a><span>Component preview / original portfolio visuals</span></div>
  </main>
}
