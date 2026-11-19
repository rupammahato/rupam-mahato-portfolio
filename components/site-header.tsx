'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import CommandPalette from './command-palette'
import { contact } from '@/lib/site-data'
import { sections } from '@/lib/navigation'

export default function SiteHeader() {
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const targets = sections.map(section => document.getElementById(section.toLowerCase())).filter((element): element is HTMLElement => element !== null).reverse()
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = targets.length ? Number.parseFloat(getComputedStyle(targets[0]).scrollMarginTop) + 1 : 0
      const current = targets.find(element => element.getBoundingClientRect().top <= threshold)
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      setActive(atEnd ? 'contact' : current?.id || '')
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || header.current?.querySelector('dialog[open]')) return
      setMenuOpen(false)
      toggle.current?.focus()
    }
    const onPointer = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false) }
    const desktop = window.matchMedia('(min-width: 1001px)')
    const onResize = () => { if (desktop.matches) setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  return <header ref={header} className="site-header" onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setMenuOpen(false)
  }}><div className="wrap header-inner">
    <a className="header-identity" href="#top" aria-label="Rupam Mahato home" onClick={() => setMenuOpen(false)}><span className="monogram">RM<span>.</span></span><span className="header-name">Rupam Mahato</span></a>
    <nav id="primary-navigation" className={`site-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Primary">
      {sections.map(section => {
        const id = section.toLowerCase()
        return <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{section}</a>
      })}
    </nav>
    <div className="header-tools"><CommandPalette go={section => { setMenuOpen(false); window.location.hash = section.toLowerCase() }} /><a className="btn btn-sm btn-ghost header-resume" href={contact.resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={14} aria-hidden="true" /></a><button ref={toggle} type="button" className="menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="primary-navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button></div>
  </div><noscript><style>{`.header-tools .kbd-btn { display: none; }
  @media (max-width: 1000px) {
    .site-header { position: static; height: auto; }
    .header-inner { flex-wrap: wrap; padding-block: var(--space-3); }
    .site-nav { display: flex; position: static; order: 3; width: 100%; max-height: none; overflow: visible; padding: 0; border: 0; }
    .menu-toggle { display: none; }
    .hero { padding-top: var(--space-12); }
  }`}</style></noscript></header>
}
