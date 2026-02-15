"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface WishlistItem {
  _id: string
  product: {
    _id: string
    title: string
    price: number
    priceAfterDiscount?: number
    imageCover: string
  }
}



export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please login first")
      setLoading(false)
      return
    }

    async function fetchWishlist() {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setWishlist(data.data || [])
      } catch (err) {
        console.error(err)
        setError("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!wishlist.length) return <div className="p-10 text-center">No products in your wishlist</div>

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {wishlist.map((item) => (
        <Link key={item._id} href={`/products/${item.product._id}`}>
          <div className="border p-2 rounded shadow cursor-pointer hover:scale-105 transition">
            <Image
              src={item.product.imageCover}
              alt={item.product.title}
              width={200}
              height={200}
              className="object-contain"
            />
            <h3 className="text-center font-semibold mt-2">{item.product.title}</h3>
            <p className="text-center text-green-600 font-bold">
              {item.product.priceAfterDiscount ?? item.product.price} EGP
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
