'use client'

import { Product } from '@/types/productinterface'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { AddToCart } from '../Addtocart'
import { AddToWishlist } from '../../addtowishlist/Addtowishlist'

interface Props {
  prod: Product
}

export function ProductCard({ prod }: Props) {
  return (
    <Card className="relative w-full max-w-sm hover:shadow-lg transition rounded-lg overflow-hidden">
      
      <Link href={`/products/${prod._id}`} className="block">
        <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
          <Image src={prod.imageCover || "/placeholder.png"} alt={prod.title} fill className="object-cover" />
        </div>

        <CardHeader className="px-4 py-2">
          <CardAction>
            {prod.brand?.name && <Badge variant="secondary">{prod.brand.name}</Badge>}
          </CardAction>

          <CardDescription className="my-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{prod.price} EGP</span>
              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                {prod.ratingsAverage?.toFixed(1)} ⭐
              </span>
            </div>
          </CardDescription>
        </CardHeader>
      </Link>

      <CardFooter className="flex items-center justify-between px-4 py-2">
        <AddToCart productId={prod._id} variant="sm" />
        <AddToWishlist productId={prod._id} />
      </CardFooter>
    </Card>
  )
}