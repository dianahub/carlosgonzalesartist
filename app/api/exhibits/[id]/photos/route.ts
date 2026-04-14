import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const photos = await prisma.exhibitPhoto.findMany({
    where: { exhibitId: params.id },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { imageUrl, cloudinaryId, caption } = body

  if (!imageUrl || !cloudinaryId) {
    return NextResponse.json({ error: 'imageUrl and cloudinaryId are required' }, { status: 400 })
  }

  const last = await prisma.exhibitPhoto.findFirst({
    where: { exhibitId: params.id },
    orderBy: { order: 'desc' },
  })

  const photo = await prisma.exhibitPhoto.create({
    data: {
      exhibitId: params.id,
      imageUrl,
      cloudinaryId,
      caption: caption ?? null,
      order: (last?.order ?? -1) + 1,
    },
  })

  return NextResponse.json(photo, { status: 201 })
}
