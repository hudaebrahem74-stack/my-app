'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from "lucide-react";

export default function Navbar() {

  const pathname = usePathname()

  const linkStyle = (path: string) =>
    `px-3 py-1 rounded transition-colors duration-200 ${
      pathname === path
        ? 'text-green-600 font-medium'
        : 'text-gray-700 hover:text-green-600'
    }`

  return (
    <nav className='fixed top-0 w-full z-50 bg-gray-300 shadow px-8 py-4'>
      <div className='flex items-center justify-between'>
        
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-1'>
            <ShoppingCart size={28} className="text-green-600" />
            <h2 className='font-semibold text-lg'>Fresh Cart</h2>
          </div>

          <ul className='flex gap-4'>
            <li><Link className={linkStyle('/')} href={'/'}>Home</Link></li>
            <li><Link className={linkStyle('/products')} href={'/products'}>Products</Link></li>
            <li><Link className={linkStyle('/brands')} href={'/brands'}>Brands</Link></li>
            <li><Link className={linkStyle('/categories')} href={'/categories'}>Categories</Link></li>
          </ul>
        </div>

        <div>
          <ul className='flex gap-4'>
            <li><Link className={linkStyle('/auth/signin')} href={'/auth/signin'}>Signin</Link></li>
            <li><Link className={linkStyle('/auth/register')} href={'/auth/register'}>Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
