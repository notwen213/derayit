"use client"

import { Header } from "@/components/header"
import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QRPay } from "@/components/qr-pay"
import { useState } from "react"

export default function CheckoutPage() {
  const { items, update, remove, total, clear } = useCart()
  const [method, setMethod] = useState<"fiat" | "crypto">("fiat")
  const [reference, setReference] = useState<string>(() => `HSHIELD-${Date.now().toString().slice(-6)}`)

  return (
    <main className="min-h-dvh">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-semibold">Checkout</h1>

        <div className="mt-6 grid gap-6">
          <div className="rounded-lg border">
            <div className="border-b px-4 py-3 font-medium">Items</div>
            <ul className="divide-y">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-muted-foreground">KES {i.price.toLocaleString()} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      aria-label={`Quantity for ${i.name}`}
                      className="w-16"
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={(e) => update(i.id, Math.max(1, Number(e.target.value || 1)))}
                    />
                    <Button variant="destructive" onClick={() => remove(i.id)}>
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">KES {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3 font-medium">Payment</div>
            <div className="grid gap-4 p-4">
              <div className="flex gap-3">
                <Button variant={method === "fiat" ? "default" : "secondary"} onClick={() => setMethod("fiat")}>
                  Mobile Money (QR)
                </Button>
                <Button variant={method === "crypto" ? "default" : "secondary"} onClick={() => setMethod("crypto")}>
                  Crypto (stub)
                </Button>
              </div>

              {method === "fiat" ? (
                <div className="grid gap-3">
                  <label className="text-sm">
                    Payment Reference
                    <Input className="mt-1" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </label>
                  <QRPay amount={total} reference={reference} />
                  <p className="text-sm text-muted-foreground">
                    Scan with M‑Pesa/Orange compatible app or show to agent. We will confirm and sync when online.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 text-sm text-muted-foreground">
                  Crypto checkout will appear here after Hedera integration is wired. For now this is a placeholder.
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={() => clear()}>
                  Clear cart
                </Button>
                <Button className="bg-primary text-primary-foreground hover:opacity-90">Place Order</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
