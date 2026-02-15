
"use client"

import React from "react"

interface Props {
  productId: string
}

export function AddToCartButton({ productId }: Props) {
  const handleAddToCart = () => {
    console.log("Added product to cart:", productId)
    alert("Product added to cart!")
  }

  return (
    <button
      onClick={handleAddToCart}
      className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
    >
      Add To Cart
    </button>
  )
}
