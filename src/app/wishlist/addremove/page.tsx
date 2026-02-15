"use client"

import React, { useState, useEffect } from "react"

interface Props {
  productId: string
}

export function WishlistButton({ productId }: Props) {
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    async function checkWishlist() {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
          method: "GET",
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

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) return alert("Please login first")

    try {
      if (inWishlist) {

        await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        setInWishlist(false)
      } else {
        await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product: productId }),
        })
        setInWishlist(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={handleToggleWishlist}
      className={`mt-2 px-4 py-1 rounded transition ${
        inWishlist ? "bg-red-600 text-white" : "bg-gray-300"
      }`}
    >
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  )
}