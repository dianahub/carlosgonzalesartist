import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const painting = await prisma.painting.findUnique({ where: { id: params.id } })
  if (!painting) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(painting)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // If the image changed, delete the old Cloudinary asset
  const existing = await prisma.painting.findUnique({ where: { id: params.id } })
  if (
    existing &&
    body.cloudinaryId &&
    existing.cloudinaryId !== body.cloudinaryId
  ) {
    await cloudinary.uploader.destroy(existing.cloudinaryId).catch(() => null)
  }

  const painting = await prisma.painting.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(painting)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const painting = await prisma.painting.findUnique({ where: { id: params.id } })
  if (!painting) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await cloudinary.uploader.destroy(painting.cloudinaryId).catch(() => null)
  await prisma.painting.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
