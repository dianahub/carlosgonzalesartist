'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Painting } from '@prisma/client'

interface Props {
  painting?: Painting
}

export function PaintingForm({ painting }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [fields, setFields] = useState({
    title: painting?.title ?? '',
    width: painting?.width?.toString() ?? '',
    height: painting?.height?.toString() ?? '',
    unit: painting?.unit ?? 'in',
    medium: painting?.medium ?? '',
    price: painting?.price?.toString() ?? '',
    status: painting?.status ?? 'available',
    order: painting?.order?.toString() ?? '0',
    visible: painting?.visible ?? true,
  })

  const [imageUrl, setImageUrl] = useState(painting?.imageUrl ?? '')
  const [cloudinaryId, setCloudinaryId] = useState(painting?.cloudinaryId ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: data })
      if (!res.ok) throw new Error('Upload failed')

      const json = await res.json()
      setImageUrl(json.url)
      setCloudinaryId(json.publicId)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl) { setError('Please upload an image first.'); return }

    setSaving(true)
    setError('')

    const payload = {
      title: fields.title,
      width: parseFloat(fields.width),
      height: parseFloat(fields.height),
      unit: fields.unit,
      medium: fields.medium,
      price: fields.price ? parseFloat(fields.price) : null,
      status: fields.status,
      order: parseInt(fields.order, 10),
      visible: fields.visible,
      imageUrl,
      cloudinaryId,
    }

    try {
      const url = painting ? `/api/paintings/${painting.id}` : '/api/paintings'
      const res = await fetch(url, {
        method: painting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      router.push('/admin/paintings')
      router.refresh()
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-[#f5f0e8] focus:outline-none focus:border-white/30 transition-colors text-sm'
  const labelClass = 'block text-xs text-white/40 mb-1.5 tracking-widest uppercase'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Image Upload */}
      <div>
        <label className={labelClass}>Painting Image *</label>
        {imageUrl && (
          <div className="mb-4 border border-white/10 inline-block">
            <Image
              src={imageUrl}
              alt="Preview"
              width={400}
              height={300}
              style={{ maxHeight: 280, width: 'auto', height: 'auto', display: 'block' }}
            />
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 border border-white/20 text-xs tracking-widest uppercase hover:bg-white/5 transition-colors disabled:opacity-40"
        >
          {uploading ? 'Uploading…' : imageUrl ? 'Replace Image' : 'Upload Image'}
        </button>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input type="text" required value={fields.title} onChange={set('title')} className={inputClass} />
      </div>

      {/* Dimensions */}
      <div>
        <label className={labelClass}>Dimensions *</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              placeholder="Width"
              value={fields.width}
              onChange={set('width')}
              className={inputClass}
            />
          </div>
          <div>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              placeholder="Height"
              value={fields.height}
              onChange={set('height')}
              className={inputClass}
            />
          </div>
          <div>
            <select value={fields.unit} onChange={set('unit')} className={inputClass}>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medium */}
      <div>
        <label className={labelClass}>Medium *</label>
        <input
          type="text"
          required
          placeholder="e.g. Oil on canvas"
          value={fields.medium}
          onChange={set('medium')}
          className={inputClass}
        />
      </div>

      {/* Price + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (USD, optional)</label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="Leave blank to hide"
            value={fields.price}
            onChange={set('price')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={fields.status} onChange={set('status')} className={inputClass}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="not_for_sale">Not for Sale</option>
          </select>
        </div>
      </div>

      {/* Order + Visible */}
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className={labelClass}>Display Order</label>
          <input
            type="number"
            value={fields.order}
            onChange={set('order')}
            className={inputClass}
          />
        </div>
        <div className="pb-2.5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={fields.visible}
              onChange={e => setFields(f => ({ ...f, visible: e.target.checked }))}
              className="w-4 h-4 accent-white"
            />
            <span className="text-sm text-white/60">Visible on public site</span>
          </label>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-3 bg-white/8 border border-white/15 text-xs tracking-widest uppercase hover:bg-white/12 transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : painting ? 'Update Painting' : 'Add Painting'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/paintings')}
          className="px-8 py-3 border border-white/10 text-xs tracking-widest uppercase hover:bg-white/5 transition-colors text-white/40"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
