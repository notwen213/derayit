"use client"

import useSWR from "swr"

export type CartItem = { id: string; name: string; price: number; qty: number }
type CartState = { items: CartItem[] }

const CART_KEY = "hs-cart"

export function useCart() {
  // SWR as a local client store; initialize from localStorage
  const { data, mutate } = useSWR<CartState>("cart", {
    fallbackData: { items: [] },
  })

  function persist(next: CartState) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next))
    } catch {}
  }

  // Hydrate from localStorage on first use
  if (typeof window !== "undefined" && data?.items?.length === 0) {
    const raw = localStorage.getItem(CART_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CartState
      // mutate without revalidation
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      mutate(parsed, { revalidate: false })
    }
  }

  function add(item: CartItem) {
    mutate(
      (current) => {
        const next = current ?? { items: [] }
        const idx = next.items.findIndex((i) => i.id === item.id)
        if (idx >= 0) next.items[idx] = { ...next.items[idx], qty: next.items[idx].qty + item.qty }
        else next.items.push(item)
        const snapshot = { items: [...next.items] }
        persist(snapshot)
        return snapshot
      },
      { revalidate: false },
    )
  }

  function update(id: string, qty: number) {
    mutate(
      (current) => {
        const next = { items: (current?.items ?? []).map((i) => (i.id === id ? { ...i, qty } : i)) }
        persist(next)
        return next
      },
      { revalidate: false },
    )
  }

  function remove(id: string) {
    mutate(
      (current) => {
        const next = { items: (current?.items ?? []).filter((i) => i.id !== id) }
        persist(next)
        return next
      },
      { revalidate: false },
    )
  }

  function clear() {
    const next = { items: [] as CartItem[] }
    persist(next)
    mutate(next, { revalidate: false })
  }

  const total = (data?.items ?? []).reduce((s, i) => s + i.price * i.qty, 0)

  return { items: data?.items ?? [], add, update, remove, clear, total }
}
