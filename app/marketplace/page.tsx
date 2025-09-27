"use client"

import useSWR from "swr"
import { ProductCard } from "@/components/marketplace/product-card"
import type { Product } from "@/lib/products"
import { Header } from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/use-cart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MarketplacePage() {
  const { data } = useSWR<{ products: Product[] }>("/api/products", fetcher)
  const { items, total } = useCart()

  return (
    <main className="min-h-dvh">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Marketplace</h1>
          <Link href="/checkout" aria-label="Go to checkout">
            <Button variant="secondary">
              Cart • {items.length} • KES {total.toLocaleString()}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
