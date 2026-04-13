'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Exhibit {
  id?:          string
  title:        string
  venue:        string
  location:     string
  startDate:    string
  endDate:      string
  description:  string
  link:         string
  visible:      boolean
}

const empty: Exhibit = {
  title: '', venue: '', location: '', startDate: '', endDate: '',
  description: '', link: '', visible: true,
}

export function ExhibitForm({ initial }: { initial?: Partial<Exhibit> }) {
  const router = useRouter()
  const [form, setForm] = useState<Exhibit>({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof Exhibit, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url    = form.id ? `/api/exhibits/${form.id}` : '/api/exhibits'
    const method = form.id ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        endDate: form.endDate || null,
        description: form.description || null,
        link: form.link || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      setSaving(false)
      return
    }

    router.push('/admin/exhibits')
    router.refresh()
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-[#f5f0e8] focus:outline-none focus:border-white/30 transition-colors text-sm'
  const labelCls = 'block text-xs tracking-widest uppercase text-white/35 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className={labelCls}>Title *</label>
        <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Venue *</label>
          <input className={inputCls} value={form.venue} onChange={e => set('venue', e.target.value)} required placeholder="Gallery name" />
        </div>
        <div>
          <label className={labelCls}>Location *</label>
          <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} required placeholder="City, Country" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Date *</label>
          <input type="date" className={inputCls} value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input type="date" className={inputCls} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} resize-y`}
          rows={4}
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Link (optional)</label>
        <input className={inputCls} type="url" value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://…" />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="visible"
          type="checkbox"
          checked={form.visible}
          onChange={e => set('visible', e.target.checked)}
          className="w-4 h-4 accent-white/60"
        />
        <label htmlFor="visible" className="text-xs tracking-widest uppercase text-white/35">Visible on site</label>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-white/8 border border-white/15 text-xs tracking-widest uppercase hover:bg-white/12 transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Create Exhibit'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/exhibits')}
          className="text-xs text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
