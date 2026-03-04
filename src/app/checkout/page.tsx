'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartData {
  numOfCartItems: number;
  data: {
    _id: string;
    totalCartPrice: number;
  };
}

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState<'cash' | 'online'>('cash');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', { headers: { token } });
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

  const handleOrder = async () => {
    if (!address.trim()) {
      setCheckoutError('Please enter shipping address');
      return;
    }
    setCheckoutError('');
    const token = localStorage.getItem('token');
    if (!token || !cart?.data?._id) return;
    setSubmitting(true);
    try {
      if (payMethod === 'online') {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart.data._id}?url=${encodeURIComponent(window.location.origin + '/orders')}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', token },
            body: JSON.stringify({ shippingAddress: { details: address, city: city || 'Cairo', phone: phone || '' } })
          }
        );
        const data = await res.json();
        if (data.status === 'success' && data.session?.url) {
          window.location.href = data.session.url;
          return;
        }
        throw new Error(data.message || 'Checkout failed');
      } else {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cart.data._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', token },
          body: JSON.stringify({ shippingAddress: { details: address, city: city || 'Cairo', phone: phone || '' } }),
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          router.push('/orders');
          router.refresh();
        } else {
          throw new Error(data.message || 'Order failed');
        }
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = () => setCheckoutError('');

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Please login</p>
        <Link href="/auth/signin">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Login</button>
        </Link>
      </div>
    );
  }

  if (!cart?.data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Cart is empty</p>
        <Link href="/products">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Shop Now</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="space-y-6">
        {checkoutError && (
          <div className="rounded-md bg-red-100 p-3 text-sm text-red-600">{checkoutError}</div>
        )}
        <div>
          <label className="mb-2 block font-medium">Shipping Address</label>
          <Input
            value={address}
            onChange={(e) => { setAddress(e.target.value); clearError(); }}
            placeholder="Street, building, floor"
            required
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cairo"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">Phone</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div>
          <label className="mb-2 block font-medium">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={payMethod === 'cash'}
                onChange={() => setPayMethod('cash')}
              />
              Cash on Delivery
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={payMethod === 'online'}
                onChange={() => setPayMethod('online')}
              />
              Pay Online
            </label>
          </div>
        </div>
        <p className="font-semibold">Total: {cart.data.totalCartPrice} EGP</p>
        <button
          onClick={handleOrder}
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {submitting ? 'Processing...' : payMethod === 'online' ? 'Pay Online' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}