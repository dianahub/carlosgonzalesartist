import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { DeleteButton } from './DeleteButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Paintings' }

const STATUS_COLOR: Record<string, string> = {
  available: 'border-emerald-500/30 text-emerald-400',
  sold: 'border-white/15 text-white/35',
  not_for_sale: 'border-white/15 text-white/35',
}

export default async function AdminPaintingsPage() {
  const paintings = await prisma.painting.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Paintings</h1>
        <Link
          href="/admin/paintings/new"
          className="px-4 py-2 border border-white/20 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
        >
          + Add Painting
        </Link>
      </div>

      {paintings.length === 0 ? (
        <p className="text-white/30 text-center py-20">
          No paintings yet —{' '}
          <Link href="/admin/paintings/new" className="underline underline-offset-4 hover:text-white/60">
            add your first
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-2">
          {paintings.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 border border-white/8 hover:border-white/15 transition-colors"
            >
              <Image
                src={p.imageUrl}
                alt={p.title}
                width={60}
                height={60}
                className="object-cover flex-shrink-0"
                style={{ width: 60, height: 60, objectFit: 'cover' }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-serif truncate">{p.title}</p>
                <p className="text-sm text-white/35 mt-0.5">
                  {p.medium} · {p.width}×{p.height} {p.unit}
                  {p.price ? ` · $${p.price.toLocaleString()}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`hidden sm:inline-block text-xs px-2 py-0.5 border ${STATUS_COLOR[p.status] ?? 'border-white/15 text-white/35'}`}
                >
                  {p.status.replace('_', ' ')}
                </span>
                <span
                  className={`hidden sm:inline-block text-xs px-2 py-0.5 border ${
                    p.visible ? 'border-white/20 text-white/50' : 'border-white/8 text-white/20'
                  }`}
                >
                  {p.visible ? 'visible' : 'hidden'}
                </span>
                <Link
                  href={`/admin/paintings/${p.id}/edit`}
                  className="px-3 py-1.5 text-xs border border-white/15 hover:bg-white/5 transition-colors tracking-widest uppercase"
                >
                  Edit
                </Link>
                <DeleteButton id={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
