import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const content = await prisma.siteContent.findUnique({ where: { key: 'bio' } })
  const bio = content?.value ?? ''

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Gzo signature — large display */}
      <div className="mb-12">
        <div className="relative w-48 h-28 overflow-hidden">
          <Image
            src="/gzo-logo.jpeg"
            alt="Gzo signature"
            fill
            className="object-cover"
            style={{ objectPosition: '90% 0%' }}
            priority
          />
        </div>
        <p className="mt-3 text-white/35 text-sm tracking-widest uppercase">
          Carlos González
        </p>
      </div>

      <div className="space-y-6">
        {bio.split('\n').filter(Boolean).map((paragraph, i) => (
          <p key={i} className="text-[#f5f0e8]/75 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Instagram */}
      <div className="mt-12 pt-8 border-t border-white/8">
        <a
          href="https://instagram.com/gzogallery"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white/70 transition-colors tracking-widest"
        >
          @gzogallery
        </a>
      </div>
    </div>
  )
}
