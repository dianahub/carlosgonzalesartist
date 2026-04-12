import type { Metadata } from 'next'
import { PaintingForm } from '@/components/admin/PaintingForm'

export const metadata: Metadata = { title: 'Admin — New Painting' }

export default function NewPaintingPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-10">New Painting</h1>
      <PaintingForm />
    </div>
  )
}
