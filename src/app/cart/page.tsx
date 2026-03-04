'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
  };
  count: number;
  price: number;
}

interface CartData {
  numOfCartItems: number;
  data: {
    _id: string;
    products: CartItem[];
    totalCartPrice: number;
  };
}

export default function Cart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
        headers: { token },
      });
      const data = await res.json();
      if (res.ok) setCart(data);
      else setCart(null);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${itemId}`, {
        method: 'DELETE',
        headers: { token },
      });
      if (res.ok) fetchCart();
    } catch {}
  };

  const updateCount = async (itemId: string, count: number) => {
    if (count < 1) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ count }),
      });
      if (res.ok) fetchCart();
    } catch {}
  };

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center py-12">Loading...</div>;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-12">
        <p>Please login to view cart</p>
        <Link href="/auth/signin" className="px-4 py-2 bg-green-600 text-white rounded">Login</Link>
      </div>
    );
  }

  if (!cart?.data?.products?.length) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-12">
        <p>Cart is empty</p>
        <Link href="/products" className="px-4 py-2 bg-green-600 text-white rounded">Shop Now</Link>
      </div>
    );
  }

  const { products, totalCartPrice } = cart.data;

  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-bold">Cart</h1>
      <div className="space-y-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex gap-4">
              <Image
                src={item.product.imageCover}
                alt={item.product.title}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
              <div>
                <Link href={`/productdetails/${item.product._id}`} className="font-medium hover:underline">
                  {item.product.title}
                </Link>
                <p className="text-gray-600">{item.price} EGP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateCount(item._id, item.count - 1)}
                  disabled={item.count <= 1}
                >
                  -
                </button>
                <span className="h-8 w-14 text-center text-sm">{item.count}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateCount(item._id, item.count + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between border-t pt-4">
        <span className="text-lg font-semibold">Total: {totalCartPrice} EGP</span>
        <Link
          href="/checkout"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}