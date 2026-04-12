import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const painting = await prisma.painting.findUnique({ where: { id: params.id } })
  return { title: painting?.title ?? 'Painting' }
}

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  sold: 'Sold',
  not_for_sale: 'Not for Sale',
}

export default async function PaintingPage({ params }: Props) {
  const painting = await prisma.painting.findUnique({
    where: { id: params.id, visible: true },
  })

  if (!painting) notFound()

  const label = STATUS_LABEL[painting.status] ?? painting.status

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-block text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase mb-10"
      >
        ← Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image */}
        <div>
          <Image
            src={painting.imageUrl}
            alt={painting.title}
            width={Math.round(painting.width * 20)}
            height={Math.round(painting.height * 20)}
            style={{ width: '100%', height: 'auto' }}
            priority
            className="w-full"
          />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl mb-3">{painting.title}</h1>
            <p className="text-white/50 text-sm">{painting.medium}</p>
            <p className="text-white/50 text-sm">
              {painting.width} × {painting.height} {painting.unit}
            </p>
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 text-xs tracking-widest uppercase border ${
                painting.status === 'available'
                  ? 'border-emerald-500/40 text-emerald-400'
                  : 'border-white/15 text-white/35'
              }`}
            >
              {label}
            </span>
          </div>

          {painting.price && painting.status === 'available' && (
            <p className="font-serif text-2xl">${painting.price.toLocaleString()}</p>
          )}

          {painting.status === 'available' && (
            <Link
              href={`/contact`}
              className="block text-center py-3 border border-white/20 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
            >
              Inquire About This Piece
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
