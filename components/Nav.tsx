'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Gallery' },
  { href: '/exhibits', label: 'Exhibits' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="border-b border-white/8 px-6 py-3 relative z-50">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-75 transition-opacity flex-shrink-0" onClick={() => setOpen(false)}>
          <div className="relative w-[90px] h-[52px] overflow-hidden">
            <Image
              src="/gzo-logo.jpeg"
              alt="Gzo — Carlos González"
              fill
              className="object-cover"
              style={{ objectPosition: '90% 0%' }}
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white/90 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setOpen(prev => !prev)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-white/60 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block h-px bg-white/60 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px bg-white/60 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col pt-4 pb-2 gap-1 border-t border-white/8 mt-3">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-1 py-3 text-xs tracking-widest uppercase transition-colors ${
                pathname === link.href ? 'text-white' : 'text-white/50 hover:text-white/90'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
