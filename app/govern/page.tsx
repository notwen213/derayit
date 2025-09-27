"use client"
import useSWR from "swr"
import { ProposalCard } from "@/components/govern/proposal-card"
import { Header } from "@/components/header"

type Proposal = {
  id: string
  title: string
  summary: string
  status: "active" | "queued" | "closed"
  yes: number
  no: number
  deadline: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function GovernPage() {
  const { data, error, isLoading } = useSWR<Proposal[]>("/api/proposals", fetcher)

  return (
    <main className="mx-auto w-full max-w-5xl p-4">
      <Header />
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">Community Governance</h1>
        <p className="text-muted-foreground">
          Propose, discuss, and vote on changes that improve HederaShield for everyone.
        </p>
      </header>

      {isLoading ? <p className="text-muted-foreground">Loading proposals…</p> : null}
      {error ? <p className="text-destructive">Failed to load proposals.</p> : null}

      {data ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((p) => (
            <ProposalCard key={p.id} {...p} />
          ))}
        </section>
      ) : null}
    </main>
  )
}
