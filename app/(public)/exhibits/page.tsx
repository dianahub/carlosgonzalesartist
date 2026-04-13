import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Exhibits' }

function formatDateRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric', day: 'numeric' }
  const s = new Date(start).toLocaleDateString('en-US', opts)
  if (!end) return s
  const e = new Date(end).toLocaleDateString('en-US', opts)
  return `${s} — ${e}`
}

export default async function ExhibitsPage() {
  const exhibits = await prisma.exhibit.findMany({
    where: { visible: true },
    orderBy: { startDate: 'desc' },
  })

  const now = new Date()
  const upcoming = exhibits.filter(e => new Date(e.startDate) >= now)
  const past     = exhibits.filter(e => new Date(e.startDate) <  now)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-[#f5f0e8] mb-16 tracking-wide">Exhibits</h1>

      {exhibits.length === 0 && (
        <p className="text-white/30 text-sm tracking-wide">No exhibits listed yet.</p>
      )}

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs tracking-widest uppercase text-white/30 mb-8">Upcoming</h2>
          <div className="space-y-10">
            {upcoming.map(exhibit => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs tracking-widest uppercase text-white/30 mb-8">Past</h2>
          <div className="space-y-10">
            {past.map(exhibit => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ExhibitCard({ exhibit }: { exhibit: {
  id: string
  title: string
  venue: string
  location: string
  startDate: Date
  endDate: Date | null
  description: string | null
  link: string | null
}}) {
  return (
    <article className="border-l border-white/10 pl-6">
      <p className="text-xs text-white/30 tracking-widest uppercase mb-1">
        {formatDateRange(exhibit.startDate, exhibit.endDate)}
      </p>
      <h3 className="font-serif text-xl text-[#f5f0e8] mb-1">{exhibit.title}</h3>
      <p className="text-sm text-white/40 mb-3">{exhibit.venue} — {exhibit.location}</p>
      {exhibit.description && (
        <p className="text-sm text-white/55 leading-relaxed mb-3">{exhibit.description}</p>
      )}
      {exhibit.link && (
        <a
          href={exhibit.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
        >
          More info →
        </a>
      )}
    </article>
  )
}
