import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const photo = await prisma.exhibitPhoto.findUnique({ where: { id: params.photoId } })
  if (!photo || photo.exhibitId !== params.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await cloudinary.uploader.destroy(photo.cloudinaryId).catch(() => null)
  await prisma.exhibitPhoto.delete({ where: { id: params.photoId } })

  return NextResponse.json({ ok: true })
}
