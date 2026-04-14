'use client'

import { useState, useEffect } from 'react'

const DEFAULT_EMAIL = 'gzographix@yahoo.com'
const DEFAULT_PHONE = '305 494 2020'

export default function ContactPage() {
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [phone, setPhone] = useState(DEFAULT_PHONE)

  useEffect(() => {
    fetch('/api/content?key=contact_email')
      .then(r => r.json())
      .then(d => { if (d?.value) setEmail(d.value) })
      .catch(() => {})

    fetch('/api/content?key=contact_phone')
      .then(r => r.json())
      .then(d => { if (d?.value) setPhone(d.value) })
      .catch(() => {})
  }, [])

  const labelClass = 'block text-xs text-white/40 mb-2 tracking-widest uppercase'

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl mb-12">Contact</h1>

      <div className="space-y-8">
        <div>
          <p className={labelClass}>Email</p>
          <a
            href={`mailto:${email}`}
            className="text-[#f5f0e8] hover:text-white/70 transition-colors text-lg"
          >
            {email}
          </a>
        </div>
        <div>
          <p className={labelClass}>Phone</p>
          <a
            href={`tel:+1${phone.replace(/\D/g, '')}`}
            className="text-[#f5f0e8] hover:text-white/70 transition-colors text-lg"
          >
            {phone}
          </a>
        </div>
      </div>
    </div>
  )
}
