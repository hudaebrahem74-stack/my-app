import { Product } from "@/types/productinterface"
import Image from "next/image"
import { AddToCartButton } from "@/components/AddToCartButton"

interface Props {
  params: { id: string }
}

export default async function ProductDetails({ params }: Props) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${params.id}`, { cache: "no-store" })
  const data = await res.json()
  const product: Product = data.data

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-6">
      <div>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
          <Image src={product.imageCover} alt={product.title} fill className="object-contain" />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {product.images?.length ? (
            product.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={img} alt={`${product.title} ${i}`} fill className="object-contain" />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No additional images</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-xl font-bold text-green-600 mb-2">
          {product.priceAfterDiscount ?? product.price} EGP
        </p>

        <p className="mb-2">⭐ {product.ratingsAverage} ({product.ratingsQuantity})</p>
        <p className="mb-2">Brand: <span className="font-semibold">{product.brand.name}</span></p>
        <p className="mb-4">Category: <span className="font-semibold">{product.category.name}</span></p>

        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
