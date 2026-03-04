'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AddToCartProps {
  productId: string
  variant?: 'default' | 'sm'
}

export function AddToCart({ productId, variant = 'default' }: AddToCartProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setMsg('Please login')
      return
    }

    setLoading(true)
    setMsg('')

    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ productId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add product')

      setMsg('Added')
      router.refresh()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleAdd}
        disabled={loading}
        className={`px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition ${
          variant === 'sm' ? 'text-sm py-1 px-2' : ''
        }`}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {msg && (
        <span className="text-xs mt-1">
          {msg === 'Please login' ? (
            <Link href="/auth/signin" className="text-primary underline">
              Login
            </Link>
          ) : (
            msg
          )}
        </span>
      )}
    </div>
  )
}