"use client"

import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { QrScanner } from "@/components/verify/qr-scanner"
import { ManualLookup } from "@/components/verify/manual-lookup"
import { ResultCard } from "@/components/verify/result-card"
import { Header } from "@/components/header"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function useVerify(code: string | null) {
  const url = useMemo(() => (code ? `/api/verify?code=${encodeURIComponent(code)}` : null), [code])
  return useSWR(url, fetcher, { revalidateOnFocus: false })
}

export default function VerifyPage() {
  const [code, setCode] = useState<string | null>(null)
  const { data, error, isLoading, mutate } = useVerify(code)

  const handleScan = useCallback((text: string) => {
    setCode(text)
  }, [])

  const handleManual = useCallback((text: string) => {
    setCode(text.trim())
  }, [])

  const reset = () => {
    setCode(null)
    mutate(undefined, { revalidate: false })
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <Header />
      <header className="mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Verify Government Payment</h1>
        <p className="text-pretty text-muted-foreground">
          Scan a QR code or enter a reference to confirm payment authenticity and status on-chain.
        </p>
      </header>

      <section className="grid gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-medium text-foreground">Scan QR</h2>
        <QrScanner onResult={handleScan} />
      </section>

      <div className="my-6">
        <Separator />
      </div>

      <section className="grid gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-medium text-foreground">Manual Lookup</h2>
        <ManualLookup onSubmit={handleManual} />
      </section>

      {code ? (
        <section className="mt-6 grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Result</h2>
            <Button variant="secondary" onClick={reset}>
              Check another
            </Button>
          </div>

          {isLoading ? <p className="text-muted-foreground">Verifying…</p> : null}
          {error ? <p className="text-destructive">Verification failed.</p> : null}
          {data ? <ResultCard result={data} /> : null}
        </section>
      ) : null}
    </main>
  )
}
