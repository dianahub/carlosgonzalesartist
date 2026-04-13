import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Gallery' },
  { href: '/exhibits', label: 'Exhibits' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="border-b border-white/8 px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo — shows the Gzo brushstroke signature from the card image */}
        <Link href="/" className="hover:opacity-75 transition-opacity flex-shrink-0">
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

        <nav className="flex gap-8">
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
      </div>
    </header>
  )
}
