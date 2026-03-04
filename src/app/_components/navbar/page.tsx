'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Heart, ClipboardList, LogOut } from "lucide-react";
 
export default function Navbar() {

  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<{ name: string } | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setCartCount(cart.length)
    setWishlistCount(wishlist.length)
  }, [])

  const linkStyle = (path: string) =>
    `relative px-2 py-1 transition-all duration-200 ${
      pathname === path
        ? 'text-green-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-green-600'
        : 'text-gray-700 hover:text-green-600'
    }`

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth/signin')
  }

  return (
    <nav className='fixed top-0 w-full z-50 bg-white shadow-md px-10 py-4'>
      <div className='flex items-center justify-between'>

        <div className='flex items-center gap-8'>
          <h2 className='font-bold text-xl text-green-600 tracking-wide'>
            Fresh Cart
          </h2>

          <ul className='flex items-center gap-6 text-sm font-medium'>
            <li><Link className={linkStyle('/')} href="/">Home</Link></li>
            <li><Link className={linkStyle('/products')} href="/products">Products</Link></li>
            <li><Link className={linkStyle('/brands')} href="/brands">Brands</Link></li>
            <li><Link className={linkStyle('/categories')} href="/categories">Categories</Link></li>

            {user && (
              <li>
                <Link
                  href="/orders"
                  className={`${linkStyle('/orders')} flex items-center gap-1`}
                >
                  <ClipboardList size={16} />
                  Orders
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className='flex items-center gap-6'>

          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-700 font-medium text-sm'>
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className='flex items-center gap-1 text-red-600 hover:text-red-800 text-sm'
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className='flex gap-4 text-sm'>
              <Link className='text-gray-700 hover:text-green-600' href="/auth/signin">
                Signin
              </Link>
              <Link className='text-gray-700 hover:text-green-600' href="/auth/register">
                Register
              </Link>
            </div>
          )}

          <div className='relative'>
            <Link href="/cart" className='text-gray-700 hover:text-green-600'>
              <ShoppingCart size={22} />
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          <div className='relative'>
            <Link href="/wishlist" className='text-gray-700 hover:text-green-600'>
              <Heart size={22} />
            </Link>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}