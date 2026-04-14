'use client'

import { useState, useEffect } from 'react'

const DEFAULT_EMAIL = 'gzographix@yahoo.com'
const DEFAULT_PHONE = '305 494 2020'

export default function ContactAdminPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/content?key=contact_email').then(r => r.json()),
      fetch('/api/content?key=contact_phone').then(r => r.json()),
    ]).then(([emailData, phoneData]) => {
      setEmail(emailData?.value ?? DEFAULT_EMAIL)
      setPhone(phoneData?.value ?? DEFAULT_PHONE)
      setLoading(false)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await Promise.all([
      fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_email', value: email }),
      }),
      fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_phone', value: phone }),
      }),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#f5f0e8] focus:outline-none focus:border-white/30 transition-colors font-sans text-sm'
  const labelClass = 'block text-xs text-white/40 mb-2 tracking-widest uppercase'

  if (loading) {
    return (
      <div>
        <h1 className="font-serif text-3xl mb-10">Contact Info</h1>
        <p className="text-white/30">Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Contact Info</h1>
      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <p className="text-sm text-white/35">
          This email and phone number appear on the public Contact page.
        </p>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white/8 border border-white/15 text-sm tracking-widest uppercase hover:bg-white/12 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save Contact Info'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
        </div>
      </form>
    </div>
  )
}
