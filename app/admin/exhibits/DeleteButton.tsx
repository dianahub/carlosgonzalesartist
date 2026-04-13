'use client'

import { useRouter } from 'next/navigation'

export function DeleteExhibitButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this exhibit?')) return
    await fetch(`/api/exhibits/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs tracking-widest uppercase text-white/25 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  )
}
