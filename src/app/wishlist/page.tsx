'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('https://ecommerce.routemisr.com/api/v1/wishlist', { headers: { token } })
      .then(res => res.json())
      .then(data => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!localStorage.getItem('token')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p>Please login to view your wishlist</p>
        <Link href="/auth/signin" className="px-4 py-2 bg-green-600 text-white rounded">Login</Link>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p>Your wishlist is empty</p>
        <Link href="/products" className="px-4 py-2 bg-green-600 text-white rounded">Shop Now</Link>
      </div>
    );
  }

  // Inline component بدل import
  function AddToWishlist({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
          method: 'PUT',
          headers: { token },
        });
        if (!res.ok) throw new Error('Failed');
        window.location.reload();
      } finally {
        setLoading(false);
      }
    };

    return (
      <button onClick={handleToggle} disabled={loading} className="p-1 mt-2 hover:opacity-70" title="Add / Remove Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="p-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map(prod => (
        <div key={prod._id} className="border rounded p-4 flex flex-col gap-2">
          <img src={prod.image} alt={prod.title} className="w-full h-48 object-cover rounded" />
          <h3 className="font-semibold text-lg">{prod.title}</h3>
          <p className="text-gray-600 text-sm">{prod.description}</p>
          <p className="font-bold">${prod.price}</p>
          <AddToWishlist productId={prod._id} />
        </div>
      ))}
    </div>
  );
}