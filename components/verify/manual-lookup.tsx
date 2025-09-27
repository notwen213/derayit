"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ManualLookup({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState("")
  const [err, setErr] = useState<string | null>(null)

  function handle() {
    const c = code.trim()
    if (!c) {
      setErr("Enter a reference or QR payload")
      return
    }
    setErr(null)
    onSubmit(c)
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="code">Reference or QR payload</Label>
      <Input
        id="code"
        placeholder="e.g., OK-KE-NCPB-2025-000123"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {err ? (
        <p className="text-sm text-destructive" role="alert">
          {err}
        </p>
      ) : null}
      <div className="mt-1">
        <Button onClick={handle}>Verify</Button>
      </div>
    </div>
  )
}
