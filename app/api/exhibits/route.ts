import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const exhibits = await prisma.exhibit.findMany({
    where: { visible: true },
    orderBy: { startDate: 'desc' },
  })
  return NextResponse.json(exhibits)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, venue, location, startDate, endDate, description, imageUrl, link, visible } = body

  if (!title || !venue || !location || !startDate) {
    return NextResponse.json({ error: 'title, venue, location, startDate are required' }, { status: 400 })
  }

  const exhibit = await prisma.exhibit.create({
    data: {
      title,
      venue,
      location,
      startDate: new Date(startDate),
      endDate:   endDate ? new Date(endDate) : null,
      description: description ?? null,
      imageUrl:    imageUrl ?? null,
      link:        link ?? null,
      visible:     visible ?? true,
    },
  })

  return NextResponse.json(exhibit, { status: 201 })
}
