import React from 'react'
import Link from 'next/link'

interface Cate {
  _id: string
  name: string
  slug: string
  image: string
}

export default async function Categories() {
  const req = await fetch(
    'https://ecommerce.routemisr.com/api/v1/categories',
    { cache: 'no-store' }
  )

  const data = await req.json()
  const allCate: Cate[] = data.data

  return (
    <div className='grid grid-cols-3 gap-6 p-10'>
      {allCate.map((cate) => (
        <Link key={cate._id} href={`/categories/${cate._id}`}>
          <div className='border border-blue-200 rounded shadow overflow-hidden cursor-pointer hover:scale-105 transition'>
            <img
              className='w-full h-48 object-contain'
              src={cate.image}
              alt={cate.name}
            />
            <h3 className='text-center p-3 font-semibold'>
              {cate.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
