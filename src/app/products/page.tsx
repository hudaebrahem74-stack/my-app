'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '../_components/productcard/page'
import { Product } from '@/types/productinterface'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/products')
        const data = await res.json()
        setProducts(data.data || [])
      } catch (err) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p className="text-center mt-20">Loading products...</p>
  if (!products.length) return <p className="text-center mt-20">No products found</p>

  return (
    <div className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((prod) => (
        <ProductCard key={prod._id} prod={prod} />
      ))}
    </div>
  )
}