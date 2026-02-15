import Image from "next/image"
import Link from "next/link"

interface Cate {
  _id: string
  name: string
  slug: string
  image: string
}

export default async function Categories() {
  let allCate: Cate[] = []

  try {
    const req = await fetch(
      "https://ecommerce.routemisr.com/api/v1/categories",
      { cache: "no-store" }
    )

    if (!req.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Failed to load categories
        </div>
      )
    }

    const data = await req.json()
    allCate = data.data || []
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Something went wrong
      </div>
    )
  }

  if (!allCate.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No categories available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-10">
      {allCate.map((cate) => (
        <Link key={cate._id} href={`/categories/${cate._id}`}>
          <div className="border border-blue-200 rounded shadow overflow-hidden cursor-pointer hover:scale-105 transition">
            <Image
              className="w-full h-48 object-contain"
              src={cate.image || "/placeholder.png"}
              alt={cate.name}
              width={400}
              height={200}
            />
            <h3 className="text-center p-3 font-semibold">
              {cate.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
