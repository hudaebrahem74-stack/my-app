import Image from "next/image"

interface Brand {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface Props {
  params: { brandDetails: string }
}

export default async function BrandDetails({ params }: Props) {
  let brand: Brand | null = null

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${params.brandDetails}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Failed to load brand
        </div>
      )
    }

    const data = await res.json()
    brand = data.data || null
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Something went wrong
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="p-10 text-center text-gray-500">
        Brand not found
      </div>
    )
  }

  return (
    <div className="p-10 flex justify-center">
      <div className="w-80 border rounded shadow overflow-hidden">
        <Image
          src={brand.image || "/placeholder.png"}
          alt={brand.name}
          width={400}
          height={300}
          className="w-full h-60 object-cover"
        />
        <h3 className="text-center font-semibold p-3">
          {brand.name}
        </h3>
      </div>
    </div>
  )
}
