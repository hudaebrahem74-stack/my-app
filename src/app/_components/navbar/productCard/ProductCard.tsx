import { Product } from "@/types/productinterface"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product._id}`}>
      <Card className="relative w-full max-w-sm cursor-pointer hover:scale-105 transition-transform">

        <div className="relative w-full aspect-square rounded-t-lg overflow-hidden">
          <Image
            src={product.imageCover || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>


        <CardHeader>
          <CardAction>
            <Badge variant="secondary">Featured</Badge>
          </CardAction>
          <CardTitle className="line-clamp-1">{product.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>


        <CardFooter className="flex flex-col gap-2">
          <p className="font-bold text-green-600">
            {product.priceAfterDiscount ?? product.price} EGP
          </p>
          <Button className="w-full">View Product</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
