import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DeleteExhibitButton } from './DeleteButton'

export const dynamic = 'force-dynamic'

function fmt(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminExhibitsPage() {
  const exhibits = await prisma.exhibit.findMany({ orderBy: { startDate: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl">Exhibits</h1>
        <Link
          href="/admin/exhibits/new"
          className="px-5 py-2 bg-white/8 border border-white/15 text-xs tracking-widest uppercase hover:bg-white/12 transition-colors"
        >
          + Add Exhibit
        </Link>
      </div>

      {exhibits.length === 0 && (
        <p className="text-white/30 text-sm">No exhibits yet. Add one above.</p>
      )}

      <div className="space-y-4">
        {exhibits.map(ex => (
          <div
            key={ex.id}
            className="flex items-center justify-between border border-white/8 px-5 py-4 rounded"
          >
            <div>
              <p className="text-[#f5f0e8] font-serif text-lg leading-tight">{ex.title}</p>
              <p className="text-white/40 text-sm mt-0.5">{ex.venue} — {ex.location}</p>
              <p className="text-white/25 text-xs mt-1">{fmt(ex.startDate)}{ex.endDate ? ` — ${fmt(ex.endDate)}` : ''}</p>
            </div>
            <div className="flex items-center gap-3 ml-6">
              {!ex.visible && (
                <span className="text-xs text-white/25 tracking-widest uppercase">hidden</span>
              )}
              <Link
                href={`/admin/exhibits/${ex.id}/edit`}
                className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
              >
                Edit
              </Link>
              <DeleteExhibitButton id={ex.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
