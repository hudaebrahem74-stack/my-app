import Image from "next/image"

interface Brand {
  _id: string
  name: string
  image: string
}

export default async function Brands() {
  let allBrands: Brand[] = []

  try {
    const req = await fetch(
      "https://ecommerce.routemisr.com/api/v1/brands",
      { cache: "no-store" }
    )

    if (!req.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Failed to load brands
        </div>
      )
    }

    const data = await req.json()
    allBrands = data.data || []
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Something went wrong
      </div>
    )
  }

  if (!allBrands.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No brands available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {allBrands.map((brand) => (
        <div
          key={brand._id}
          className="border border-blue-100 rounded shadow p-2 flex flex-col items-center"
        >
          <Image
            src={brand.image || "/placeholder.png"}
            alt={brand.name}
            width={200}
            height={130}
            className="object-contain"
          />
          <h3 className="text-center mt-2 font-semibold">
            {brand.name}
          </h3>
        </div>
      ))}
    </div>
  )
}
