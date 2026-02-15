'use client'

import React, { useState, useEffect } from 'react'

export default function AddRemoveWishlistPage() {
  const [inWishlist, setInWishlist] = useState(false)
  const productId = '123' // ممكن تجي من props أو params

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    async function checkWishlist() {
      try {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const ids = data.data?.map((item: any) => item.product._id) || []
        setInWishlist(ids.includes(productId))
      } catch (err) {
        console.error(err)
      }
    }

    checkWishlist()
  }, [productId])

  return (
    <div className="p-6 text-center">
      <h2>Wishlist Add/Remove</h2>
      <p>{inWishlist ? 'In Wishlist' : 'Not in Wishlist'}</p>
    </div>
  )
}
