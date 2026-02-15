import { Product } from "@/types/productinterface"
import Image from "next/image"
import Link from "next/link"

export default async function Products() {
  let allProducts: Product[] = []

  try {
    const req = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products",
      { cache: "no-store" }
    )

    if (!req.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Failed to load products
        </div>
      )
    }

    const data = await req.json()
    allProducts = data.data || []
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Something went wrong
      </div>
    )
  }

  if (!allProducts.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No products available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {allProducts.map((prod) => (
        <Link key={prod._id} href={`/products/${prod._id}`}>
          <div className="group border p-3 rounded-lg shadow hover:shadow-lg transition flex flex-col cursor-pointer relative">

            {prod.priceAfterDiscount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded z-10">
                Sale
              </span>
            )}

            <div className="relative w-full aspect-square mb-3 overflow-hidden rounded">
              <Image
                src={prod.imageCover || "/placeholder.png"}
                alt={prod.title}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="text-center font-semibold mt-2 line-clamp-1">
              {prod.title}
            </h3>

            <div className="text-center mt-1">
              {prod.priceAfterDiscount ? (
                <>
                  <p className="text-gray-400 line-through">
                    {prod.price} EGP
                  </p>
                  <p className="text-green-600 font-bold">
                    {prod.priceAfterDiscount} EGP
                  </p>
                </>
              ) : (
                <p className="text-green-600 font-bold">
                  {prod.price} EGP
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              ⭐ {prod.ratingsAverage}
            </p>

          </div>
        </Link>
      ))}
    </div>
  )
}
