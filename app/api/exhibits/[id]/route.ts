import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const exhibit = await prisma.exhibit.findUnique({ where: { id: params.id } })
  if (!exhibit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(exhibit)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, venue, location, startDate, endDate, description, imageUrl, link, visible } = body

  const exhibit = await prisma.exhibit.update({
    where: { id: params.id },
    data: {
      title,
      venue,
      location,
      startDate:   new Date(startDate),
      endDate:     endDate ? new Date(endDate) : null,
      description: description ?? null,
      imageUrl:    imageUrl ?? null,
      link:        link ?? null,
      visible:     visible ?? true,
    },
  })

  return NextResponse.json(exhibit)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const photos = await prisma.exhibitPhoto.findMany({ where: { exhibitId: params.id } })
  await Promise.all(photos.map(p => cloudinary.uploader.destroy(p.cloudinaryId).catch(() => null)))

  await prisma.exhibit.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
