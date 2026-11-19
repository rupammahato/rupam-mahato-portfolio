// Site content, kept separate from the UI so server components (case-study pages) can read it too.

export const contact = {
  email: 'rupammahato593@gmail.com',
  github: 'https://github.com/rupammahato',
  linkedin: 'https://linkedin.com/in/rupammahato',
  codeforces: 'https://codeforces.com/profile/DarkKnight05',
  leetcode: 'https://leetcode.com/u/DarkKnight_05/',
  resume: 'https://drive.google.com/file/d/1-7Neo2kdEGhm3f6RZ6FyV9D3cLZSLNXC/view?usp=sharing',
}
export const updated = 'Sep 2026'

// Headline numbers, each taken from the résumé.
export const proof = [
  { value: '5K+', label: 'concurrent users at Megalith registration peaks' },
  { value: '2,046', label: 'req/s benchmarked on the consistent-hashing load balancer' },
  { value: '26 days', label: 'from zero to a payments-live MVP at Zyke' },
  { value: '93', label: 'routes re-authenticated across origins at 10X Analysts' },
]

export const skillCategories: Record<string, string[]> = {
  Backend: ['Python', 'Django', 'Flask', 'FastAPI', 'Node.js', 'Express.js'],
  Frontend: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  'AI/ML': ['LangChain', 'LangGraph', 'LlamaIndex', 'RAG', 'Pinecone', 'pgvector', 'Neo4j'],
  Cloud: ['PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Nginx'],
}
export const skills = Object.values(skillCategories).flat()

export const education = { school: 'Indian Institute of Technology Kharagpur', degree: 'Dual Degree — B.Tech. Civil Engineering & M.Tech. Environmental Engineering & Management', period: 'Nov 2022 — May 2027' }

export const awards: [string, string][] = [
  ['Sponsorship Lead, Megalith 17th edition', 'Secured INR 1 Million from L&T, Tata Steel, JSW & FOSROC — 133% YoY growth'],
  ['Team & intern mentorship', 'Mentored a 40+ member team and 40+ interns across 18+ events for 1000+ participants from 50+ colleges — footfall up 150% YoY'],
  ['IIT Bombay Action Plan 2024', 'Finalist — pitched a sustainable business model to industry investors'],
  ['Smart India Hackathon 2023', 'Top Team Selection — architected a scalable, complex solution'],
  ['Hero CoLabs Design Challenge 5.0', '2nd Runner-Up of 4,734 — high-fidelity prototypes delivered with precision'],
]

export type Visual = 'ring' | 'gate' | 'tenants'
export type Project = { title: string; type: string; year: string; tags: string[]; description: string; outcome: { value: string; label: string }; visual: Visual; link?: string; linkLabel?: string; repo?: string }

export const projects: Project[] = [
  { title: 'Consistent Hashing Load Balancer', type: 'Distributed systems', year: '2026', tags: ['Node.js', 'Express.js', 'http-proxy'], description: 'A load balancer on a consistent-hashing ring with virtual nodes, automatic failover and health checks — only 19.66% of keys remap when a node dies, benchmarked at 2,046 req/s. Ships with a live console that plots every vnode and traces real requests onto the ring.', outcome: { value: '19.66%', label: 'of keys remapped on node failure' }, visual: 'ring', link: 'https://load-balancer-khaki.vercel.app/', linkLabel: 'Open live console', repo: 'https://github.com/rupammahato/load-balancer' },
  // No link: https://megalith.co.in/ fails HTTPS (TLS alert) as of 2026-09-19; restore it with linkLabel 'Visit site' once fixed.
  { title: 'Megalith 2025', type: 'Event platform', year: '2025', tags: ['Next.js', 'TypeScript', 'MongoDB', 'JWT'], description: "The official Next.js site for IIT Kharagpur's civil engineering fest — 42.7% YoY user growth and 5K+ concurrent users at registration peaks, with role-based JWT auth, an admin analytics dashboard, and automated Razorpay orders, PDF certificates and mail.", outcome: { value: '42.7%', label: 'year-over-year user growth' }, visual: 'gate' },
  { title: 'Membition', type: 'RAG platform', year: '2024', tags: ['Next.js', 'Flask', 'Pinecone', 'OpenAI'], description: "A multi-tenant RAG chatbot platform for NGOs, delivered as a client project — each nonprofit's knowledge base is isolated behind its own Pinecone index, PDFs are ingested through a hardened pipeline, and a 13-rule system prompt keeps answers in scope and declines medical, legal and financial advice.", outcome: { value: 'Tenant isolation', label: 'a separate knowledge index for each NGO' }, visual: 'tenants' },
]

export const services = [
  { title: 'Backend APIs & systems', description: 'REST/Express, Django and FastAPI services — auth flows, rate-limited integrations, and payment and payroll systems (Razorpay HMAC webhooks, idempotent credits, HMRC-rule audits) built to survive real load.' },
  { title: 'AI & RAG pipelines', description: 'Retrieval-augmented pipelines and LLM integrations — multi-tenant pgvector and Pinecone knowledge bases, async document ingestion, and multi-provider agent orchestration.' },
  { title: 'Cloud & infrastructure', description: 'Session/auth infrastructure across origins, Docker/AWS deployment, consistent-hashing load balancing, and cost-metered usage tracking across cloud and LLM providers.' },
  { title: 'Full-stack MVPs', description: 'End-to-end products, schema to UI, for founders who need a working system fast — as sole engineer or embedded in a small team.' },
]

// [role, organisation, period, summary]
export const experience: [string, string, string, string][] = [
  ['Full Stack Developer Intern', 'Neosophical Labs · Goa, India', 'May 2026 — Jul 2026', 'Built a UK payroll-bureau SLA engine from scratch (task state machine, working-day-aware nightly scan, tiered alerts, audit trail) and audited the payroll calculation engine against a 30-section BRD and HMRC rules, fixing 4 pro-rata, rounding and back-pay defects. Also shipped a Telegram bot orchestrating Codex & Hermes agents for daily marketing digests across GA4, Google Ads & Meta, and a LangChain pipeline normalising Excel, XML & PDF client files into one relational schema.'],
  ['Full Stack Developer', 'Datsol Solutions | Posterity Consulting · Remote', 'Nov 2025 — May 2026', 'Solely built the hiring module — a token-gated candidate portal with signed, expiring, revocable links and 3 scoped rate limiters — and the BFS org-hierarchy resolver behind every manager view. Fixed a sync crash from blank-timestamp rows hitting a unique index, and hardened sheet ingestion against timezone and subdocument data loss.'],
  ['Backend Engineering Intern', '10X Analysts · Remote', 'May 2025 — Jul 2025', "Owned the knowledge-base APIs for a pgvector RAG corpus (async embedding via a Cloud Tasks worker) and isolated each tenant behind an owner/public/shared access model gating retrieval and Neo4j graph reads. Rebuilt cross-origin session auth across 93 routes by deriving NextAuth's HKDF key to decrypt JWEs, and designed the BFF proxy fronting 42 FastAPI route handlers so bearer tokens stay off the client."],
  ['Founding Engineer', 'Zyke — AI Social Media Content Platform · Remote', 'Oct 2024 — Jan 2025', 'Shipped a payments-live MVP in 26 days as sole engineer (45 of 49 commits): a 26-endpoint Flask API and a Next.js 14 client. Metered per-request AI spend across 7 LLM/image providers into USD credit debits, and built the money path end to end — Razorpay orders, HMAC webhook verification, replay-safe idempotency and atomic credit debits.'],
]
