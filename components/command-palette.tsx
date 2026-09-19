'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { contact, projects } from '@/lib/site-data'

type Item = { label: string; hint: string; run: () => void }
const SECTIONS = ['Work', 'Services', 'About', 'Stack', 'Contact']

// Cmd/Ctrl+K quick-jump, built on a native <dialog> (focus trap, Esc, inert background come free).
export default function CommandPalette({ go }: { go: (section: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [mac, setMac] = useState(false)

  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) { setQuery(''); setActive(0); d.showModal() }
    if (!open && d.open) d.close()
  }, [open])

  const items = useMemo<Item[]>(() => [
    ...SECTIONS.map(s => ({ label: `Go to ${s}`, hint: 'Section', run: () => go(s) })),
    ...projects.map(p => ({ label: p.title, hint: 'Project', run: () => go('Work') })),
    { label: 'Open résumé', hint: 'Google Drive', run: () => { window.open(contact.resume, '_blank', 'noopener') } },
    { label: 'Copy email address', hint: contact.email, run: () => { navigator.clipboard?.writeText(contact.email).catch(() => { window.location.href = `mailto:${contact.email}` }) } },
    { label: 'Send an email', hint: 'mailto', run: () => { window.location.href = `mailto:${contact.email}` } },
    ...[['GitHub', contact.github], ['LinkedIn', contact.linkedin], ['Codeforces', contact.codeforces], ['LeetCode', contact.leetcode]].map(([label, url]) => ({ label, hint: 'Link', run: () => { window.open(url, '_blank', 'noopener') } })),
  ], [go])
  const shown = items.filter(i => `${i.label} ${i.hint}`.toLowerCase().includes(query.trim().toLowerCase()))
  const current = Math.min(active, Math.max(shown.length - 1, 0))

  useEffect(() => { document.getElementById(`cmd-${current}`)?.scrollIntoView({ block: 'nearest' }) }, [current, open])

  const run = (item?: Item) => { if (!item) return; setOpen(false); item.run() }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((current + 1) % Math.max(shown.length, 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((current - 1 + shown.length) % Math.max(shown.length, 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); run(shown[current]) }
  }

  return <>
    <button className="kbd-btn" onClick={() => setOpen(true)} aria-label="Open quick jump menu" aria-haspopup="dialog"><Search size={14} /><span>Search</span><kbd>{mac ? '⌘' : 'Ctrl'} K</kbd></button>
    <dialog ref={dialog} className="palette" aria-label="Quick jump" onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
      <div className="palette-box">
        <input className="palette-input" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={shown.length ? `cmd-${current}` : undefined} aria-label="Search sections, projects and links" placeholder="Jump to a section, project or link…" value={query} onChange={e => { setQuery(e.target.value); setActive(0) }} onKeyDown={onKeyDown} />
        <ul id="cmd-list" role="listbox" className="palette-list">
          {shown.map((item, i) => <li key={`${item.label}-${item.hint}`} id={`cmd-${i}`} role="option" aria-selected={i === current} className={i === current ? 'is-active' : ''} onMouseMove={() => setActive(i)} onClick={() => run(item)}><span>{item.label}</span><small>{item.hint}</small></li>)}
        </ul>
        {!shown.length && <p className="palette-empty">Nothing matches “{query}”.</p>}
      </div>
    </dialog>
  </>
}
