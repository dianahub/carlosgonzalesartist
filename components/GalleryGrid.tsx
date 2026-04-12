import { Painting } from '@prisma/client'
import { PaintingCard } from './PaintingCard'

export function GalleryGrid({ paintings }: { paintings: Painting[] }) {
  if (paintings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-white/25">
        <p className="font-serif text-3xl mb-2">No paintings yet.</p>
        <p className="text-sm tracking-widest uppercase">Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-12 max-w-[1600px] mx-auto">
      {/* Masonry via CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {paintings.map(painting => (
          <PaintingCard key={painting.id} painting={painting} />
        ))}
      </div>
    </div>
  )
}
