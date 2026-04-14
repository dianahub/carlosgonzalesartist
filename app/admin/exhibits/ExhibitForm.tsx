'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

interface ExhibitPhoto {
  id:           string
  imageUrl:     string
  cloudinaryId: string
  caption:      string | null
  order:        number
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

  // Photos state (only relevant when editing)
  const [photos, setPhotos] = useState<ExhibitPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (form.id) {
      fetch(`/api/exhibits/${form.id}/photos`)
        .then(r => r.json())
        .then(setPhotos)
        .catch(() => {})
    }
  }, [form.id])

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

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !form.id) return

    setUploading(true)
    setPhotoError('')

    try {
      const data = new FormData()
      data.set('file', file)
      const upRes = await fetch('/api/upload', { method: 'POST', body: data })
      if (!upRes.ok) throw new Error('Upload failed')
      const { url, publicId } = await upRes.json()

      const addRes = await fetch(`/api/exhibits/${form.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url, cloudinaryId: publicId }),
      })
      if (!addRes.ok) throw new Error('Failed to save photo')
      const newPhoto = await addRes.json()
      setPhotos(prev => [...prev, newPhoto])
    } catch {
      setPhotoError('Photo upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDeletePhoto(photoId: string) {
    if (!form.id) return
    if (!confirm('Delete this photo?')) return

    const res = await fetch(`/api/exhibits/${form.id}/photos/${photoId}`, { method: 'DELETE' })
    if (res.ok) {
      setPhotos(prev => prev.filter(p => p.id !== photoId))
    }
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

      {/* Photos section — only shown when editing an existing exhibit */}
      {form.id && (
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <p className={labelCls.replace('mb-1.5', '')}>Photos</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-1.5 bg-white/8 border border-white/15 text-xs tracking-widest uppercase hover:bg-white/12 transition-colors disabled:opacity-40"
            >
              {uploading ? 'Uploading…' : '+ Add Photo'}
            </button>
          </div>

          {photoError && <p className="text-red-400 text-sm">{photoError}</p>}

          {photos.length === 0 ? (
            <p className="text-xs text-white/25 tracking-wide">No photos yet. Upload some above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square relative overflow-hidden border border-white/10">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption ?? 'Exhibit photo'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-black/70 text-white/70 hover:text-white text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!form.id && (
        <p className="text-xs text-white/25 tracking-wide pt-2 border-t border-white/10">
          You can add photos after creating the exhibit.
        </p>
      )}
    </form>
  )
}
