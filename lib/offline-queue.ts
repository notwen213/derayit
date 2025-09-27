export type QueuedAction = {
  id: string
  url: string
  method: "POST" | "PUT" | "DELETE"
  body: unknown
  createdAt: number
}

const STORAGE_KEY = "hs_offline_queue_v1"

function readQueue(): QueuedAction[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QueuedAction[]) : []
  } catch {
    return []
  }
}

function writeQueue(q: QueuedAction[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(q))
}

export function queueAction(a: Omit<QueuedAction, "id" | "createdAt">) {
  const item: QueuedAction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
    ...a,
  }
  const q = readQueue()
  q.push(item)
  writeQueue(q)
  return item.id
}

export async function flushQueue(onSuccess?: (a: QueuedAction) => void) {
  if (typeof window === "undefined") return
  const q = readQueue()
  const remaining: QueuedAction[] = []
  for (const a of q) {
    try {
      const res = await fetch(a.url, {
        method: a.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a.body ?? {}),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      onSuccess?.(a)
    } catch {
      remaining.push(a)
    }
  }
  writeQueue(remaining)
}

export function listenForOnline(onSuccess?: (a: QueuedAction) => void) {
  if (typeof window === "undefined") return
  const handler = () => {
    flushQueue(onSuccess)
  }
  window.addEventListener("online", handler)
  return () => window.removeEventListener("online", handler)
}
