import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ExhibitForm } from '../../ExhibitForm'

export const dynamic = 'force-dynamic'

export default async function EditExhibitPage({ params }: { params: { id: string } }) {
  const exhibit = await prisma.exhibit.findUnique({ where: { id: params.id } })
  if (!exhibit) notFound()

  const initial = {
    id:          exhibit.id,
    title:       exhibit.title,
    venue:       exhibit.venue,
    location:    exhibit.location,
    startDate:   exhibit.startDate.toISOString().slice(0, 10),
    endDate:     exhibit.endDate ? exhibit.endDate.toISOString().slice(0, 10) : '',
    description: exhibit.description ?? '',
    link:        exhibit.link ?? '',
    visible:     exhibit.visible,
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Edit Exhibit</h1>
      <ExhibitForm initial={initial} />
    </div>
  )
}
