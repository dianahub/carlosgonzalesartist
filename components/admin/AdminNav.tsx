'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin/paintings', label: 'Paintings' },
  { href: '/admin/exhibits', label: 'Exhibits' },
  { href: '/admin/bio', label: 'About' },
  { href: '/admin/contact', label: 'Contact' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-white/8 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase"
          >
            ← Site
          </Link>
          <span className="text-white/15">|</span>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
