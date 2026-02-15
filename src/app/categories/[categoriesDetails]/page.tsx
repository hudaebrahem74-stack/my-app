import Image from "next/image"

interface Categ {
  _id: string
  name: string
  slug: string
  image: string
}

interface Props {
  params: { categoriesDetails: string }
}

export default async function CategoriesDetails({ params }: Props) {
  let category: Categ | null = null

  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${params.categoriesDetails}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return (
        <div className="p-10 text-center text-red-500">
          Failed to load category
        </div>
      )
    }

    const data = await res.json()
    category = data.data || null
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Something went wrong
      </div>
    )
  }

  if (!category) {
    return (
      <div className="p-10 text-center text-gray-500">
        Category not found
      </div>
    )
  }

  return (
    <div className="p-10 flex justify-center">
      <div className="w-80 border rounded shadow overflow-hidden">
        <Image
          src={category.image || "/placeholder.png"}
          alt={category.name}
          width={400}
          height={300}
          className="w-full h-60 object-cover"
        />
        <h3 className="text-center font-semibold p-3">
          {category.name}
        </h3>
      </div>
    </div>
  )
}
