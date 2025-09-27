"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { queueAction, flushQueue, listenForOnline } from "@/lib/offline-queue"

export function VotePanel({ proposalId, disabled }: { proposalId: string; disabled?: boolean }) {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null)
  const [status, setStatus] = useState<string>("")
  const [unsub, setUnsub] = useState<null | (() => void)>(null)

  useEffect(() => {
    const off = listenForOnline(() => setStatus("Reconnected. Pending votes sent."))
    setUnsub(() => off ?? null)
    return () => {
      off?.()
    }
  }, [])

  async function submitOnline() {
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, choice }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  }

  async function handleVote() {
    if (!choice) return
    // Offline-first
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueAction({ url: "/api/votes", method: "POST", body: { proposalId, choice } })
      setStatus("Offline: vote queued. It will be sent when you reconnect.")
      return
    }
    try {
      await submitOnline()
      setStatus("Vote recorded successfully.")
      // Try flushing any leftover queued votes
      await flushQueue()
    } catch {
      // Fallback to queue if submit fails
      queueAction({ url: "/api/votes", method: "POST", body: { proposalId, choice } })
      setStatus("Network issue: vote queued.")
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="text-base font-semibold text-foreground">Cast your vote</h3>
      <RadioGroup
        className="mt-3 grid gap-2"
        onValueChange={(v) => setChoice(v as "yes" | "no")}
        aria-label="Vote choice"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="vote-yes" disabled={disabled} />
          <Label htmlFor="vote-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="vote-no" disabled={disabled} />
          <Label htmlFor="vote-no">No</Label>
        </div>
      </RadioGroup>
      <div className="mt-3">
        <Button onClick={handleVote} disabled={!choice || disabled}>
          Submit vote
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
