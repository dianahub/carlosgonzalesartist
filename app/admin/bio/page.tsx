'use client'

import { useState, useEffect } from 'react'

export default function BioPage() {
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content?key=bio')
      .then(r => r.json())
      .then(data => {
        setBio(data?.value ?? '')
        setLoading(false)
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'bio', value: bio }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-serif text-3xl mb-10">Bio</h1>
        <p className="text-white/30">Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">Bio</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        <p className="text-sm text-white/35">
          Use blank lines to separate paragraphs. This text appears on the About page.
        </p>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={14}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-[#f5f0e8] focus:outline-none focus:border-white/30 transition-colors resize-y font-sans text-sm leading-relaxed"
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white/8 border border-white/15 text-sm tracking-widest uppercase hover:bg-white/12 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save Bio'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
        </div>
      </form>
    </div>
  )
}
