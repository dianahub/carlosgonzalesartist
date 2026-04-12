import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const paintings = await prisma.painting.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(paintings)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const painting = await prisma.painting.create({ data: body })
  return NextResponse.json(painting, { status: 201 })
}
