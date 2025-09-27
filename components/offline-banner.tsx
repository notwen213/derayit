"use client"

import { useEffect, useState } from "react"

export function OfflineBanner() {
  const [online, setOnline] = useState<boolean>(true)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()
    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  if (online) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 bg-accent text-accent-foreground px-4 py-2 text-center text-sm"
      role="status"
      aria-live="polite"
    >
      You are offline. Some actions are unavailable; saved data will sync when reconnected.
    </div>
  )
}
