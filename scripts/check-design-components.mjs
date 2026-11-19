import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

// Run against the local preview and a separately launched, isolated headless Chrome.
const origin = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3100'
const debug = process.env.CHROME_DEBUG_URL || 'http://127.0.0.1:9224'
const response = await fetch(`${debug}/json/new?about:blank`, { method: 'PUT' })
assert(response.ok, 'Start isolated Chrome with remote debugging enabled before running this check.')
const target = await response.json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let sequence = 0
const pending = new Map()
const exceptions = []
const assetFailures = []
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails)
  if (message.method === 'Network.responseReceived' && message.params.response.url.startsWith(`${origin}/_next/static/`) && message.params.response.status >= 400) assetFailures.push(message.params.response.url)
  if (!message.id) return
  const request = pending.get(message.id)
  if (!request) return
  clearTimeout(request.timeout)
  pending.delete(message.id)
  if (message.error) request.reject(new Error(JSON.stringify(message.error)))
  else request.resolve(message.result)
})
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)) }, 20000)
    pending.set(id, { resolve, reject, timeout })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}
async function until(expression) {
  const end = Date.now() + 15000
  while (Date.now() < end) {
    if (await evaluate(`Boolean(${expression})`)) return
    await delay(100)
  }
  assert.fail(`Timed out waiting for ${expression}`)
}
async function settle() { await evaluate('new Promise(resolve => setTimeout(resolve, 200))') }
async function key(key, code = key, modifiers = 0) {
  if (modifiers === 2) await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Control', code: 'ControlLeft', modifiers: 2, windowsVirtualKeyCode: 17 })
  const windowsVirtualKeyCode = { Escape: 27, Enter: 13, Tab: 9, ' ': 32, ArrowDown: 40, ArrowUp: 38, k: 75, a: 65 }[key]
  const text = key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers, windowsVirtualKeyCode, ...(text ? { text, unmodifiedText: text } : {}) })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode })
  if (modifiers === 2) await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Control', code: 'ControlLeft', modifiers: 0, windowsVirtualKeyCode: 17 })
}
async function screenshot(name, selector) {
  const scroll = selector ? await evaluate('({ x: scrollX, y: scrollY })') : undefined
  // Capture section clips from the document origin to avoid shifted crops in headless Chrome.
  if (selector) { await evaluate(`window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`); await settle() }
  const clip = selector ? await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height, scale: 1 }; })()`) : undefined
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: Boolean(selector), ...(clip ? { clip } : {}) })
  await writeFile(`output/design-components/${name}.png`, Buffer.from(result.data, 'base64'))
  if (scroll) { await evaluate(`window.scrollTo({ top: ${scroll.y}, left: ${scroll.x}, behavior: 'instant' })`); await settle() }
}
async function click(selector) {
  const point = await evaluate(`(() => { const element = document.querySelector(${JSON.stringify(selector)}); const rect = element.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width }; })()`)
  assert(point.width > 0, `${selector} must be visible before clicking`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y, button: 'left', clickCount: 1 })
}
async function expectRenderingStopped() {
  await settle()
  const first = await evaluate('window.__designDraws')
  await settle()
  assert.equal(await evaluate('window.__designDraws'), first, 'WebGL should stop drawing while motion is inactive')
}

try {
  await mkdir('output/design-components', { recursive: true })
  await send('Page.enable')
  await send('Page.bringToFront')
  await send('Runtime.enable')
  await send('Network.enable')
  // Keep the layout width stable when full-section screenshots hide Chrome's scrollbars.
  await send('Emulation.setScrollbarsHidden', { hidden: true })
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__designDraws = 0; for (const name of ['drawElements', 'drawArrays']) { const original = WebGL2RenderingContext.prototype[name]; WebGL2RenderingContext.prototype[name] = function(...args) { window.__designDraws++; return original.apply(this, args); }; }` })
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${origin}/design-preview` })
  await until(`document.querySelector('[data-scene-state="ready"]') && document.querySelector('canvas')`)
  await until('window.__designDraws > 0')
  assert(await evaluate(`document.querySelector('meta[name="robots"]').content.includes('noindex')`), 'Component previews must remain excluded from indexing')
  await screenshot('desktop')
  console.log('PASS: preview hydrates, WebGL draws, desktop screenshot captured')

  await evaluate(`document.querySelector('button[aria-pressed="false"]').click()`)
  await until(`document.querySelector('button[aria-pressed="true"]')?.textContent.includes('Resume')`)
  await expectRenderingStopped()
  await evaluate(`document.querySelector('button[aria-pressed="true"]').click()`)
  const previous = await evaluate('window.__designDraws')
  await until(`window.__designDraws > ${previous}`)
  console.log('PASS: pause stops rendering; resume restarts it')

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 600, deviceScaleFactor: 1, mobile: false })
  await evaluate(`window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })`)
  await until(`document.querySelector('figure').getBoundingClientRect().bottom < 0`)
  await settle()
  await expectRenderingStopped()
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' })`)
  await settle()
  await evaluate(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'))`)
  await expectRenderingStopped()
  await evaluate(`delete document.hidden; document.dispatchEvent(new Event('visibilitychange'))`)
  console.log('PASS: offscreen and simulated hidden-tab states stop rendering')

  await evaluate(`document.querySelector('.kbd-btn').focus(); document.querySelector('.kbd-btn').click()`)
  await until(`document.querySelector('dialog').open && document.activeElement?.getAttribute('role') === 'combobox'`)
  await send('Input.insertText', { text: 'Membition' })
  await until(`document.querySelectorAll('[role="option"]').length === 1`)
  assert.match(await evaluate(`document.querySelector('[role="option"]').textContent`), /Membition/)
  await screenshot('search')
  await key('a', 'KeyA', 2)
  await send('Input.insertText', { text: 'nothing-matches-this-query' })
  await until(`document.querySelectorAll('[role="option"]').length === 0`)
  await key('ArrowDown')
  await key('Enter')
  assert.equal(await evaluate(`document.querySelector('dialog').open`), true)
  await key('Escape')
  await until(`!document.querySelector('dialog').open`)
  assert.equal(await evaluate(`document.activeElement.classList.contains('kbd-btn')`), true)
  await settle()
  await key('k', 'KeyK', 2)
  await until(`document.querySelector('dialog').open`)
  await evaluate(`document.querySelector('.palette-close').click()`)
  await until(`!document.querySelector('dialog').open`)
  console.log('PASS: search filtering, empty results, keyboard shortcut, close controls and focus restoration')

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await until(`document.querySelector('button[aria-pressed="true"]')?.disabled`)
  await expectRenderingStopped()
  console.log('PASS: reduced motion produces a still scene')

  for (const width of [320, 390, 768, 1024]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false })
    await settle()
    assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Horizontal overflow at ${width}px`)
    assert(await evaluate(`Array.from(document.querySelectorAll('h1,h2,h3,button,figcaption')).every(element => { const r = element.getBoundingClientRect(); return r.width === 0 || (r.left >= -1 && r.right <= innerWidth + 1); })`), `Content clipped at ${width}px`)
    if (width === 390) await screenshot('mobile')
  }
  const ids = await evaluate(`Array.from(document.querySelectorAll('svg marker'), element => element.id)`)
  assert.equal(new Set(ids).size, ids.length, 'Repeated diagrams need unique SVG marker IDs')
  console.log('PASS: responsive widths 320/390/768/1024; unique SVG marker IDs')

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: origin })
  await until(`document.querySelector('#top [data-scene-state="ready"]')`)
  const identityTitle = 'Rupam Mahato | Backend, AI & Product Engineering'
  const identityDescription = 'Backend and AI engineering with product ownership: multi-tenant RAG platforms, payment systems and scalable infrastructure.'
  const metadata = await evaluate(`(() => {
    const meta = key => document.querySelector('meta[property="' + key + '"], meta[name="' + key + '"]')?.content;
    return { title: document.title, description: meta('description'), ogTitle: meta('og:title'), ogDescription: meta('og:description'), ogUrl: meta('og:url'), image: meta('og:image'), imageAlt: meta('og:image:alt'), twitterTitle: meta('twitter:title'), twitterDescription: meta('twitter:description'), twitterCard: meta('twitter:card'), twitterImage: meta('twitter:image'), canonical: document.querySelector('link[rel="canonical"]').href, theme: meta('theme-color'), person: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent) };
  })()`)
  assert.equal(metadata.title, identityTitle)
  assert.equal(metadata.ogTitle, identityTitle)
  assert.equal(metadata.twitterTitle, identityTitle)
  assert.equal(metadata.description, identityDescription)
  assert.equal(metadata.ogDescription, identityDescription)
  assert.equal(metadata.twitterDescription, identityDescription)
  assert.equal(metadata.canonical, 'https://rupam-mahato-portfolio.vercel.app/')
  assert.equal(new URL(metadata.ogUrl).href, metadata.canonical)
  assert.equal(metadata.twitterCard, 'summary_large_image')
  assert.equal(metadata.twitterImage, metadata.image)
  assert.equal(metadata.imageAlt, identityTitle)
  assert.equal(metadata.theme, await evaluate(`getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()`))
  assert.equal(metadata.person['@type'], 'Person')
  assert.equal(metadata.person.jobTitle, 'Backend Engineer')
  assert.equal(new URL(metadata.person.url).href, metadata.canonical)
  const shareUrl = new URL(metadata.image)
  assert.equal(shareUrl.pathname, '/opengraph-image')
  const share = await fetch(`${origin}${shareUrl.pathname}${shareUrl.search}`)
  assert(share.ok && share.headers.get('content-type').includes('image/png'))
  const sharePng = Buffer.from(await share.arrayBuffer())
  assert.deepEqual([sharePng.readUInt32BE(16), sharePng.readUInt32BE(20)], [1200, 630])
  assert(sharePng.length < 1000000, 'The social card should remain a compact asset')
  await writeFile('output/design-components/social-preview.png', sharePng)
  for (const [path, dimension] of [['/icon-32.png', 32], ['/apple-icon.png', 180]]) {
    const response = await fetch(`${origin}${path}`)
    assert(response.ok && response.headers.get('content-type').includes('image/png'))
    const png = Buffer.from(await response.arrayBuffer())
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [dimension, dimension])
  }
  const icon = await fetch(`${origin}/icon.svg`)
  assert(icon.ok && icon.headers.get('content-type').includes('image/svg+xml'))
  const missing = await fetch(`${origin}/missing-portfolio-page`)
  assert.equal(missing.status, 404)
  assert((await missing.text()).includes('noindex'))
  console.log('PASS: page, Open Graph and Twitter identity; canonical URL, structured data, icons, 1200×630 social card and 404 behavior')
  assert.equal(await evaluate(`document.querySelectorAll('h1').length`), 1)
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.proof-grid dd'), node => node.textContent)`), ['5K+', '2,046', '26 days', '93'])
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.site-nav a'), node => node.getAttribute('href'))`), ['#work', '#services', '#about', '#stack', '#contact'])
  await send('Emulation.setEmulatedMedia', { features: [] })
  await until(`document.querySelector('#top [role="status"]').textContent === 'Interactive 3D'`)
  await screenshot('landing-desktop')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  assert.equal(await evaluate(`document.querySelector('a').classList.contains('skip-link')`), true)
  await evaluate(`document.querySelector('.skip-link').focus()`)
  await key('Enter')
  await until(`document.activeElement.id === 'main-content'`)
  await click('.hero-actions a[href="#work"]')
  await until(`location.hash === '#work' && document.querySelector('.site-nav a[aria-current="location"]')?.getAttribute('href') === '#work'`)
  assert(await evaluate(`document.getElementById('work').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom`), 'Work heading must clear the fixed header')
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('#work .project-card h3'), node => node.textContent)`), ['Consistent Hashing Load Balancer', 'Megalith 2025', 'Membition'])
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('#work .project-outcome dd'), node => node.textContent)`), ['19.66%', '42.7%', 'Tenant isolation'])
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('#work .project-links a'), node => node.href)`), ['https://load-balancer-khaki.vercel.app/', 'https://github.com/rupammahato/load-balancer'])
  assert(await evaluate(`Array.from(document.querySelectorAll('#work .project-links a')).every(link => link.target === '_blank' && link.rel.includes('noopener') && link.getBoundingClientRect().height >= 44)`), 'Project links need safe new-tab behavior and touch-sized targets')
  assert.equal(await evaluate(`document.querySelectorAll('#work .spot, #work canvas').length`), 0)
  for (const width of [1440, 1024, 901, 900, 768, 520, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    await evaluate(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`)
    await settle()
    const layout = await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('#work .project-card'));
      const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width }; };
      const first = cards[0];
      return { cards: cards.map(rect), grid: rect(document.querySelector('.projects-grid')), image: rect(first.querySelector('.project-visual')), copy: rect(first.querySelector('.project-copy')), fits: Array.from(document.querySelectorAll('#work h3, #work .project-description, #work .project-outcome, #work .tag-row, #work .project-links')).every(element => { const r = element.getBoundingClientRect(); return r.x >= 0 && r.right <= innerWidth; }), readable: Array.from(document.querySelectorAll('#work svg text')).every(text => parseFloat(getComputedStyle(text).fontSize) * Math.min(text.ownerSVGElement.getBoundingClientRect().width / 360, text.ownerSVGElement.getBoundingClientRect().height / 280) >= 11), still: cards.every(card => getComputedStyle(card).opacity === '1' && card.getAnimations({ subtree: true }).length === 0) };
    })()`)
    assert.equal(layout.cards.length, 3)
    assert(Math.abs(layout.cards[0].width - layout.grid.width) <= 1, `Featured project must span the grid at ${width}px`)
    assert(layout.fits && layout.readable && layout.still, `Project content must fit, stay readable and remain still at ${width}px`)
    assert(await evaluate(`Array.from(document.querySelectorAll('#work svg text')).every(text => { const label = text.getBoundingClientRect(), svg = text.ownerSVGElement.getBoundingClientRect(); return label.top >= svg.top - 1 && label.bottom <= svg.bottom + 1 && label.left >= svg.left - 1 && label.right <= svg.right + 1; })`), `Diagram labels must stay inside their viewBox at ${width}px`)
    if (width > 900) {
      assert(layout.image.right <= layout.copy.x, 'Featured diagram and description should sit side by side')
      assert(Math.abs(layout.cards[1].y - layout.cards[2].y) <= 1, 'Supporting projects should share a row')
      assert(await evaluate(`['.project-outcome', '.tag-row', '.project-links'].every(selector => { const cards = document.querySelectorAll('.project-card'); return Math.abs(cards[1].querySelector(selector).getBoundingClientRect().top - cards[2].querySelector(selector).getBoundingClientRect().top) <= 1; })`), 'Supporting project outcomes, technologies and links should align')
    } else {
      assert(layout.image.bottom <= layout.copy.y + 1, 'Featured content should stack in reading order')
      assert(layout.cards[1].bottom < layout.cards[2].y, 'Supporting projects should stack on narrow screens')
    }
    if (width === 1440) await screenshot('work-desktop', '#work')
    if (width === 390) await screenshot('work-mobile', '#work')
  }
  console.log('PASS: featured/supporting work hierarchy, preserved links, static content and readable diagrams at 320–1440px')
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await settle()
  await click('.site-nav a[href="#services"]')
  await until(`location.hash === '#services'`)
  await evaluate('history.back()')
  await until(`location.hash === '#work' && document.querySelector('.site-nav a[aria-current="location"]')?.getAttribute('href') === '#work'`)
  for (const id of ['services', 'about', 'stack', 'contact']) {
    await click(`.site-nav a[href="#${id}"]`)
    await until(`location.hash === '#${id}' && document.querySelector('.site-nav a[aria-current="location"]')?.getAttribute('href') === '#${id}'`)
    assert(await evaluate(`document.getElementById('${id}').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1`), `${id} heading is hidden under the header`)
  }
  await expectRenderingStopped()
  assert.equal(await evaluate(`document.querySelectorAll('canvas').length`), 1, 'The homepage should retain only its contained hero canvas')
  console.log('PASS: assembled hero, exact proof metrics, native anchors, active section, browser Back and one canvas')

  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.service-row h3'), node => node.textContent)`), ['Backend APIs & systems', 'AI & RAG pipelines', 'Cloud & infrastructure', 'Full-stack MVPs'])
  assert.equal(await evaluate(`document.querySelectorAll('.awards li').length`), 5)
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.experience-row summary strong'), node => node.textContent)`), ['Full Stack Developer Intern', 'Full Stack Developer', 'Backend Engineering Intern', 'Founding Engineer'])
  assert.equal(await evaluate(`document.querySelectorAll('.experience-row[open]').length`), 1)
  assert.equal(await evaluate(`document.querySelector('.experience-row').open`), true)
  assert.equal(await evaluate(`document.querySelectorAll('#services canvas, #about canvas, .spot').length`), 0)
  await evaluate(`const summary = document.querySelectorAll('.experience-row summary')[1]; summary.scrollIntoView({ block: 'center', behavior: 'instant' }); summary.focus()`)
  await key('Enter')
  await until(`document.querySelectorAll('.experience-row')[1].open && !document.querySelector('.experience-row').open`)
  await key(' ', 'Space')
  await until(`document.querySelectorAll('.experience-row[open]').length === 0`)
  assert(await evaluate(`document.activeElement === document.querySelectorAll('.experience-row summary')[1]`), 'Collapsing experience should retain keyboard focus')
  for (let index = 0; index < 4; index++) {
    const selector = `.experience-row:nth-child(${index + 1}) summary`
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: 'center', behavior: 'instant' })`)
    await click(selector)
    await until(`document.querySelectorAll('.experience-row')[${index}].open && document.querySelectorAll('.experience-row[open]').length === 1`)
    assert(await evaluate(`document.querySelectorAll('.experience-row p')[${index}].checkVisibility()`), 'The selected experience must reveal its full summary')
  }
  await evaluate(`document.querySelector('.experience-row').open = true`)
  await evaluate('document.activeElement.blur()')
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 })
  for (const width of [1440, 1024, 901, 900, 768, 520, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    await settle()
    assert(await evaluate(`document.documentElement.scrollWidth <= innerWidth && Array.from(document.querySelectorAll('#services h3, #services p, #about h2, #about h3, #about p, #about li, #about summary')).every(element => { const r = element.getBoundingClientRect(); return r.width === 0 || (r.left >= 0 && r.right <= innerWidth); })`), `Services and background must fit at ${width}px`)
    assert(await evaluate(`Array.from(document.querySelectorAll('.experience-row summary')).every(element => element.getBoundingClientRect().height >= 44)`), 'Experience controls need touch-sized targets')
    const columns = await evaluate(`({ services: getComputedStyle(document.querySelector('.services-grid')).gridTemplateColumns.split(' ').length, background: getComputedStyle(document.querySelector('.about-grid')).gridTemplateColumns.split(' ').length })`)
    assert.equal(columns.services, width > 900 ? 2 : 1)
    assert.equal(columns.background, width > 900 ? 2 : 1)
    if (width === 1440 || width === 390) {
      const device = width === 1440 ? 'desktop' : 'mobile'
      for (const id of ['services', 'about']) {
        await evaluate(`document.getElementById('${id}').scrollIntoView({ behavior: 'instant' })`)
        await settle()
        await screenshot(`${id}-${device}`, `#${id}`)
      }
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  console.log('PASS: minimal services/background at 320–1440px; experience pointer, Enter, Space, focus and exclusive disclosure behavior')

  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.stack-group'), group => ({ category: group.querySelector('h3').textContent, tools: Array.from(group.querySelectorAll('li'), node => node.textContent) }))`), [
    { category: 'Backend', tools: ['Python', 'Django', 'Flask', 'FastAPI', 'Node.js', 'Express.js'] },
    { category: 'Frontend', tools: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'] },
    { category: 'AI/ML', tools: ['LangChain', 'LangGraph', 'LlamaIndex', 'RAG', 'Pinecone', 'pgvector', 'Neo4j'] },
    { category: 'Cloud', tools: ['PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Nginx'] },
  ])
  assert.equal(await evaluate(`document.querySelectorAll('#stack button, #stack canvas, #contact canvas, .skill-ring').length`), 0)
  assert.equal(await evaluate(`document.querySelector('.contact-email').getAttribute('href')`), 'mailto:rupammahato593@gmail.com')
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('.social-links a'), node => [node.textContent.trim(), node.href])`), [
    ['GitHub', 'https://github.com/rupammahato'],
    ['LinkedIn', 'https://linkedin.com/in/rupammahato'],
    ['Codeforces', 'https://codeforces.com/profile/DarkKnight05'],
    ['LeetCode', 'https://leetcode.com/u/DarkKnight_05/'],
  ])
  assert(await evaluate(`Array.from(document.querySelectorAll('.social-links a')).every(link => link.target === '_blank' && link.rel.includes('noopener') && link.rel.includes('noreferrer'))`))
  for (const width of [1440, 1024, 901, 900, 768, 520, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    await settle()
    assert(await evaluate(`document.documentElement.scrollWidth <= innerWidth && Array.from(document.querySelectorAll('#stack h2, #stack h3, #stack li, #contact h2, #contact p, #contact a, #contact footer > span')).every(element => { const r = element.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; })`), `Stack and contact content must fit at ${width}px`)
    assert(await evaluate(`Array.from(document.querySelectorAll('#contact a')).every(link => link.getBoundingClientRect().height >= 44)`), `Contact links need touch-sized targets at ${width}px`)
    assert(await evaluate(`Array.from(document.querySelectorAll('.skill-list li')).every(tool => tool.checkVisibility())`), 'Every skill must be directly visible')
    const columns = await evaluate(`({ stack: getComputedStyle(document.querySelector('.stack-groups')).gridTemplateColumns.split(' ').length, contact: getComputedStyle(document.querySelector('.contact-grid')).gridTemplateColumns.split(' ').length })`)
    assert.equal(columns.stack, width > 900 ? 2 : 1)
    assert.equal(columns.contact, width > 900 ? 2 : 1)
    if (width === 1440 || width === 390) {
      const device = width === 1440 ? 'desktop' : 'mobile'
      for (const id of ['stack', 'contact']) await screenshot(`${id}-${device}`, `#${id}`)
    }
  }
  await evaluate(`document.querySelector('.contact-email').focus()`)
  await key('Tab')
  assert(await evaluate(`document.activeElement === document.querySelector('.social-links a') && document.activeElement.matches(':focus-visible')`), 'Email should lead to the profile links with a visible keyboard focus')
  await evaluate(`const back = document.querySelector('footer a'); back.scrollIntoView({ behavior: 'instant', block: 'center' }); back.focus()`)
  await key('Enter')
  await until(`location.hash === '#top' && scrollY < 10`)
  console.log('PASS: all 22 skills, preserved contact destinations, touch targets, keyboard order, Back to top and responsive layouts at 320–1440px')

  const overflowingText = `(() => {
    const bad = [], walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, parent = node.parentElement;
      if (!node.textContent.trim() || !parent.checkVisibility() || parent.closest('svg, canvas, script, style, .sr-only')) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      if (Array.from(range.getClientRects()).some(r => r.width > 0 && (r.left < -1 || r.right > innerWidth + 1))) bad.push(node.textContent.slice(0, 80));
    }
    return bad;
  })()`
  for (const width of [320, 390, 768, 900, 901, 1000, 1001, 1280, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    await settle()
    assert.deepEqual(await evaluate(overflowingText), [], `Visible text must fit across the whole page at ${width}px`)
    assert(await evaluate(`(() => {
      const wraps = Array.from(document.querySelectorAll('.site-header > .wrap, main > section > .wrap'), node => node.getBoundingClientRect());
      const headings = Array.from(document.querySelectorAll('.section h2:not(.contact-title)'), node => getComputedStyle(node).fontSize);
      const padding = Array.from(document.querySelectorAll('.section'), node => getComputedStyle(node).paddingTop);
      const sections = Array.from(document.querySelectorAll('main > section'), node => node.getBoundingClientRect());
      return wraps.every(r => Math.abs(r.left - wraps[0].left) <= 1 && Math.abs(r.width - wraps[0].width) <= 1)
        && new Set(headings).size === 1 && new Set(padding).size === 1
        && sections.every((r, i) => !i || r.top >= sections[i - 1].bottom - 1);
    })()`), `Section alignment, heading scale, spacing and order must stay consistent at ${width}px`)
    if (width === 1440) await screenshot('continuity-desktop', 'body')
    if (width === 390) {
      for (const id of ['services', 'about', 'stack', 'contact']) {
        await evaluate(`window.scrollTo({ top: document.getElementById('${id}').getBoundingClientRect().top + scrollY - 330, behavior: 'instant' })`)
        await settle()
        await screenshot(`continuity-mobile-${id}`)
      }
    }
  }
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    await evaluate(`document.documentElement.style.fontSize = '200%'`)
    await settle()
    assert.deepEqual(await evaluate(overflowingText), [], `Visible text must fit at 200% text size and ${width}px`)
    await evaluate(`document.documentElement.style.fontSize = ''`)
  }
  console.log('PASS: whole-page text bounds, shared alignment, heading scale, section spacing and 200% text sizing at 320–1920px')

  for (const width of [320, 390, 768, 900, 1000, 1001, 1024]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false })
    await evaluate(`document.querySelector('.header-identity').click()`)
    await until(`location.hash === '#top' && scrollY < 10`)
    await settle()
    assert(await evaluate(`Array.from(document.querySelectorAll('.site-header a, .site-header button, #top h1, #top .hero-actions a, #top figcaption, .proof-grid')).every(element => { const r = element.getBoundingClientRect(); return r.width === 0 || (r.left >= -1 && r.right <= innerWidth + 1); })`), `Landing content clipped at ${width}px`)
    if (width <= 1000) {
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.site-nav')).display`), 'none')
      await click('.menu-toggle')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
      assert(await evaluate(`(() => { const r = document.querySelector('.site-nav').getBoundingClientRect(); return r.left <= 1 && r.width >= document.documentElement.clientWidth - 1; })()`), `Mobile menu must cover the full page width at ${width}px`)
      await key('Escape')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
      assert.equal(await evaluate(`document.activeElement.classList.contains('menu-toggle')`), true)
      await click('.menu-toggle')
      await click('.site-nav a[href="#work"]')
      await until(`location.hash === '#work' && getComputedStyle(document.querySelector('.site-nav')).display === 'none'`)
    } else assert.equal(await evaluate(`getComputedStyle(document.querySelector('.site-nav')).display`), 'flex')
    if (width === 390) {
      await evaluate(`document.querySelector('.header-identity').click()`)
      await until('scrollY < 10')
      await screenshot('landing-mobile')
      await click('.menu-toggle')
      await screenshot('landing-mobile-menu')
      await click('.hero-intro')
      await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
    }
  }
  console.log('PASS: landing widths 320–1024, mobile menu, Escape focus restoration and outside dismissal')

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 1000, deviceScaleFactor: 1, mobile: false })
  for (const id of ['work', 'services', 'about', 'stack', 'contact']) {
    await evaluate(`document.querySelector('.header-identity').click()`)
    await until(`location.hash === '#top' && scrollY < 10`)
    await evaluate(`document.querySelector('.menu-toggle').focus()`)
    await key('Enter')
    await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
    await evaluate(`document.querySelector('.site-nav a[href="#${id}"]').focus()`)
    await key('Enter')
    await until(`location.hash === '#${id}' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false' && document.querySelector('.site-nav a[aria-current="location"]')?.getAttribute('href') === '#${id}'`)
    assert(await evaluate(`document.getElementById('${id}').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1`))
    if (id === 'stack') {
      await key('Tab')
      assert(await evaluate(`document.activeElement === document.querySelector('.contact-email')`), 'Keyboard navigation should continue in the destination section, beyond the closed menu')
    }
  }
  console.log('PASS: every mobile section link works from the keyboard and preserves reading order')

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false })
  await settle()
  await click('.menu-toggle')
  await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1000, deviceScaleFactor: 1, mobile: false })
  await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false })
  await settle()
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.site-nav')).display`), 'none')
  await click('.kbd-btn')
  await until(`document.querySelector('dialog').open`)
  await send('Input.insertText', { text: 'Go to About' })
  await until(`document.querySelectorAll('[role="option"]').length === 1`)
  await key('Enter')
  await until(`location.hash === '#about' && !document.querySelector('dialog').open`)
  console.log('PASS: desktop/mobile resize closes the menu; search navigates to real sections')

  await send('Emulation.setDeviceMetricsOverride', { width: 740, height: 320, deviceScaleFactor: 1, mobile: false })
  await settle()
  await click('.menu-toggle')
  await until(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`)
  assert(await evaluate(`document.querySelector('.site-nav').getBoundingClientRect().bottom <= innerHeight + 1`), 'Landscape menu should scroll within the viewport')
  await evaluate(`document.querySelector('.site-nav a[href="#contact"]').scrollIntoView({ block: 'nearest', behavior: 'instant' })`)
  await click('.site-nav a[href="#contact"]')
  await until(`location.hash === '#contact' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
  console.log('PASS: landscape menu remains usable at 740×320')

  for (const width of [390, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false })
    for (const id of ['work', 'services', 'about', 'stack', 'contact']) {
      await send('Page.navigate', { url: 'about:blank' })
      await until(`location.href === 'about:blank'`)
      await send('Page.navigate', { url: `${origin}/#${id}` })
      await until(`document.querySelector('.site-nav a[aria-current="location"]')?.getAttribute('href') === '#${id}'`)
      assert(await evaluate(`document.getElementById('${id}').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1`))
      assert.equal(await evaluate(`document.querySelectorAll('canvas').length`), 0, 'A direct link below the hero should not mount its scene')
    }
  }
  await send('Emulation.setEmulatedMedia', { features: [] })
  await click('.site-nav a[href="#work"]')
  await until(`location.hash === '#work' && Math.abs(document.getElementById('work').getBoundingClientRect().top - parseFloat(getComputedStyle(document.getElementById('work')).scrollMarginTop)) < 2`)
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  console.log('PASS: all direct section links at desktop/mobile widths, offscreen scene loading and smooth-scroll header clearance')

  const renderChecks = []
  await send('Emulation.setEmulatedMedia', { features: [] })
  for (const mobile of [true, false]) {
    await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 })
    await send('Emulation.setDeviceMetricsOverride', { width: mobile ? 390 : 1440, height: 1100, deviceScaleFactor: 3, mobile })
    await send('Page.navigate', { url: origin })
    await until(`document.querySelector('#top [data-scene-state="ready"]') && window.__designDraws > 0`)
    const display = await evaluate(`(() => { const c = document.querySelector('canvas'), r = c.getBoundingClientRect(); return { coarse: matchMedia('(pointer: coarse)').matches, devicePixelRatio, cssWidth: r.width, bufferWidth: c.width, renderRatio: c.width / r.width }; })()`)
    assert.equal(display.coarse, mobile)
    assert(display.renderRatio <= (mobile ? 1 : 1.5) + 0.02, 'The hero must cap its rendering resolution on high-density displays')
    renderChecks.push(display)
    await evaluate(`document.querySelector('#top button[aria-pressed="false"]').click()`)
    await until(`document.querySelector('#top button[aria-pressed="true"]')`)
    await expectRenderingStopped()
  }
  await send('Emulation.setTouchEmulationEnabled', { enabled: false })
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await writeFile('output/design-components/release-checks.json', JSON.stringify({ socialImageBytes: sharePng.length, renderChecks }, null, 2))
  console.log('PASS: high-density touch/desktop rendering caps and pause behavior; emulation does not establish real-device performance')

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: `${origin}/design-preview` })
  await until(`document.querySelector('[data-scene-state="ready"]')`)
  await evaluate(`document.getElementById('component-projects').scrollIntoView({ behavior: 'instant' })`)
  await settle()
  await screenshot('project-diagrams')
  await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`)
  await until(`document.querySelector('[data-scene-state="unavailable"]')`)
  assert.equal(await evaluate(`document.querySelector('[data-scene-state] svg')?.checkVisibility()`), true)
  console.log('PASS: context loss switches to the static model')

  await send('Page.addScriptToEvaluateOnNewDocument', { source: `const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : original.call(this, type, ...args); };` })
  await send('Page.reload')
  await until(`document.querySelector('[data-scene-state="unavailable"]')`)
  assert.equal(await evaluate(`document.querySelector('[data-scene-state] svg')?.checkVisibility()`), true)
  assert.equal(await evaluate(`document.querySelector('canvas') === null`), true)
  await screenshot('webgl-fallback')
  console.log('PASS: unsupported WebGL retains the static model without a canvas')

  const markup = await (await fetch(`${origin}/design-preview`)).text()
  assert(markup.includes('Illustrative layered system model') && markup.includes('viewBox="0 0 520 460"'), 'Server HTML must include the fallback model')
  await send('Page.navigate', { url: origin })
  await until(`document.querySelector('.kbd-btn') && document.querySelectorAll('.project-visual svg').length === 3 && /\\d{2}:\\d{2}:\\d{2} IST/.test(document.querySelector('footer')?.textContent || '')`)
  await evaluate(`document.querySelector('.kbd-btn').click()`)
  await until(`document.querySelector('dialog').open`)
  await key('Escape')
  await until(`!document.querySelector('dialog').open`)
  console.log('PASS: server-rendered fallback and existing homepage component compatibility')

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: 'about:blank' })
  await until(`location.href === 'about:blank'`)
  await send('Emulation.setScriptExecutionDisabled', { value: true })
  await send('Page.navigate', { url: origin })
  await until(`document.querySelector('.site-nav') && document.querySelector('#top svg')`)
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.site-nav')).display`), 'flex')
  assert.equal(await evaluate(`document.querySelector('.header-tools .kbd-btn').checkVisibility()`), false, 'Search must be hidden when JavaScript is disabled')
  assert.equal(await evaluate(`document.querySelectorAll('canvas').length`), 0)
  await screenshot('landing-no-javascript')
  await click('.site-nav a[href="#work"]')
  await until(`location.hash === '#work'`)
  assert(await evaluate(`(() => { const cards = Array.from(document.querySelectorAll('.project-card')); return cards.length === 3 && cards.every(card => getComputedStyle(card).opacity === '1'); })()`), 'Project content must remain visible without animation JavaScript')
  assert.equal(await evaluate(`document.querySelectorAll('.service-row').length`), 4)
  assert.equal(await evaluate(`document.querySelectorAll('.experience-row p').length`), 4)
  await evaluate(`document.querySelectorAll('.experience-row summary')[3].scrollIntoView({ block: 'center', behavior: 'instant' })`)
  await click('.experience-row:nth-child(4) summary')
  await until(`document.querySelectorAll('.experience-row')[3].open && !document.querySelector('.experience-row').open`)
  assert(await evaluate(`document.querySelector('.experience-row:nth-child(4) p').checkVisibility()`), 'Experience must be expandable without JavaScript')
  assert.equal(await evaluate(`document.querySelectorAll('.stack-group').length`), 4)
  assert.equal(await evaluate(`document.querySelectorAll('.skill-list li').length`), 22)
  assert(await evaluate(`Array.from(document.querySelectorAll('.skill-list li')).every(tool => tool.checkVisibility())`), 'All tools must remain visible without JavaScript')
  assert.equal(await evaluate(`document.querySelector('.contact-email').getAttribute('href')`), 'mailto:rupammahato593@gmail.com')
  await evaluate(`document.querySelector('footer a').scrollIntoView({ behavior: 'instant', block: 'center' })`)
  await click('footer a')
  await until(`location.hash === '#top' && document.querySelector('#top h1').getBoundingClientRect().top >= 0 && document.querySelector('#top h1').getBoundingClientRect().top < innerHeight`)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false })
  assert.equal(await evaluate(`document.querySelector('.header-tools .kbd-btn').checkVisibility()`), false, 'Desktop must also hide inactive Search without JavaScript')
  assert(await evaluate(`document.querySelector('.header-resume').checkVisibility() && document.querySelector('.site-nav').checkVisibility()`), 'Desktop resume and section links must remain available without JavaScript')
  await send('Emulation.setScriptExecutionDisabled', { value: false })
  console.log('PASS: mobile navigation, hero fallback, work, services, experience, stack and contact remain usable without JavaScript')

  assert.equal(exceptions.length, 0, JSON.stringify(exceptions))
  assert.deepEqual(assetFailures, [], 'Packaged JavaScript, CSS and font assets must load successfully')
  console.log('PASS: no uncaught browser exceptions')
} catch (error) {
  await screenshot('failure').catch(() => {})
  console.error('Browser state:', await evaluate(`JSON.stringify({ url: location.href, active: document.activeElement?.outerHTML.slice(0, 250), menu: document.querySelector('.menu-toggle')?.getAttribute('aria-expanded'), search: document.querySelector('dialog')?.open })`).catch(() => 'unavailable'))
  console.error('Browser exceptions:', JSON.stringify(exceptions))
  throw error
} finally {
  socket.close()
  await fetch(`${debug}/json/close/${target.id}`).catch(() => {})
}
