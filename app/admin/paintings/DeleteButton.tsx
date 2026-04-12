'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this painting? This will also remove it from Cloudinary and cannot be undone.')) return
    setLoading(true)
    await fetch(`/api/paintings/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors tracking-widest uppercase disabled:opacity-40"
    >
      {loading ? '…' : 'Delete'}
    </button>
  )
}
