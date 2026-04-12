import { prisma } from '@/lib/prisma'
import { GalleryGrid } from '@/components/GalleryGrid'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const paintings = await prisma.painting.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })

  return <GalleryGrid paintings={paintings} />
}
