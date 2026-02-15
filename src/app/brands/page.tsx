import React from 'react'


export default async function Brands() {

let req = await fetch('https://ecommerce.routemisr.com/api/v1/brands')
let data = await req.json()
let allBrands:Brand [] = data.data
console.log(allBrands);

  return (
    <div className='grid grid-cols-5 gap-4'>
      {allBrands.map((brand) => (
  <div key={brand._id} className="border border-blue-100 rounded shadow p-2 flex flex-col items-center">
    <img src={brand.image} alt={brand.name} className="w-full h-32 object-contain" />
    <h3 className="text-center mt-2 font-semibold">{brand.name}</h3>
  </div>
))}

    </div>
  )
}
