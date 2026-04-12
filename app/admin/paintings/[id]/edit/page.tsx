import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PaintingForm } from '@/components/admin/PaintingForm'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const painting = await prisma.painting.findUnique({ where: { id: params.id } })
  return { title: `Admin — Edit ${painting?.title ?? 'Painting'}` }
}

export default async function EditPaintingPage({ params }: Props) {
  const painting = await prisma.painting.findUnique({ where: { id: params.id } })
  if (!painting) notFound()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Edit Painting</h1>
      <PaintingForm painting={painting} />
    </div>
  )
}
