import Link from 'next/link'
import Image from 'next/image'
import { Painting } from '@prisma/client'

export function PaintingCard({ painting }: { painting: Painting }) {
  // Scale physical dimensions to pixel size for Next/Image (20px per unit keeps quality)
  const w = Math.round(painting.width * 20)
  const h = Math.round(painting.height * 20)

  return (
    <Link
      href={`/painting/${painting.id}`}
      className="group block mb-6 break-inside-avoid"
    >
      <div className="relative overflow-hidden bg-white/3">
        <Image
          src={painting.imageUrl}
          alt={painting.title}
          width={w}
          height={h}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="font-serif text-base text-white leading-snug">{painting.title}</p>
          <p className="text-xs text-white/60 mt-0.5">
            {painting.width} × {painting.height} {painting.unit} &middot; {painting.medium}
          </p>
        </div>

        {/* Sold badge */}
        {painting.status === 'sold' && (
          <div className="absolute top-3 right-3 bg-black/70 px-2 py-0.5 text-xs tracking-widest uppercase text-white/50">
            Sold
          </div>
        )}
      </div>
    </Link>
  )
}
