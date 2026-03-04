'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddToWishlistProps {
  productId: string;
}

export function AddToWishlist({ productId }: AddToWishlistProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        method: 'PUT',
        headers: { token },
      });

      if (!res.ok) {
        alert("Failed to update wishlist");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-1 hover:opacity-70 text-gray-600"
      title="Add / Remove from Wishlist"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}