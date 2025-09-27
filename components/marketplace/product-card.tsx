"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/use-cart"

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          width={640}
          height={400}
          className="h-36 w-full rounded-md object-cover"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{product.unit || "unit"}</span>
          <span className="font-medium">KES {product.price.toLocaleString()}</span>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:opacity-90"
          onClick={() => add({ id: product.id, name: product.name, price: product.price, qty: 1 })}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  )
}
