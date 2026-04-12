'use client'

import type { Metadata } from 'next'
import { useState } from 'react'

// Note: metadata export must be in a server component; contact form is client-only
// For the title, set it via a wrapping server page if needed. Here we keep it simple.

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#f5f0e8] placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors'
  const labelClass = 'block text-xs text-white/40 mb-2 tracking-widest uppercase'

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl mb-12">Contact</h1>

      {status === 'sent' ? (
        <div className="py-12 text-center">
          <p className="font-serif text-2xl mb-3">Thank you.</p>
          <p className="text-white/50">Your message has been sent.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" required value={form.name} onChange={update('name')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" required value={form.email} onChange={update('email')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={update('message')}
              className={`${inputClass} resize-none`}
            />
          </div>
          {status === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong — please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 border border-white/20 text-sm tracking-widest uppercase hover:bg-white/5 transition-colors disabled:opacity-40"
          >
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
