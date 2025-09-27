import { AssetForm, type AssetDraft } from "@/components/forms/asset-form"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function TokenizePage() {
  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <Header />
      <header className="mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Tokenize an Asset</h1>
        <p className="text-pretty text-muted-foreground">
          Create a tokenized representation of a real-world asset to enable transparent tracking and governance.
        </p>
      </header>
      <TokenizeFlow />
    </main>
  )
}
;("use client")
import { useState } from "react"

function TokenizeFlow() {
  const [draft, setDraft] = useState<AssetDraft | null>(null)
  const [valid, setValid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ tokenId: string; messageId: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!draft) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { tokenId: string; messageId: string }
      setResult(data)
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6">
      <AssetForm
        onChange={(d, v) => {
          setDraft(d)
          setValid(v)
        }}
        onSubmit={(d) => {
          setDraft(d)
          setValid(true)
        }}
      />
      {draft ? (
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
          <h2 className="text-lg font-medium">RWA Preview</h2>
          <ul className="mt-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Title:</strong> {draft.title}
            </li>
            <li>
              <strong className="text-foreground">Category:</strong> {draft.category}
            </li>
            <li>
              <strong className="text-foreground">Location:</strong> {draft.location}
            </li>
            <li>
              <strong className="text-foreground">Quantity:</strong> {draft.quantity} {draft.unit}
            </li>
            <li>
              <strong className="text-foreground">Unit Price:</strong> ${draft.unitPriceUSD}
            </li>
          </ul>
          {draft.images?.length ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {draft.images.slice(0, 3).map((src, i) => (
                <img
                  key={i}
                  src={src || "/placeholder.svg"}
                  alt="RWA preview"
                  className="h-20 w-full rounded-md object-cover"
                />
              ))}
            </div>
          ) : null}
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={submit} disabled={!valid || submitting}>
              {submitting ? "Submitting..." : "Submit to tokenize"}
            </Button>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {result ? (
              <p className="text-sm text-foreground" aria-live="polite">
                Token created: <strong>{result.tokenId}</strong>, log: {result.messageId}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
