import { VotePanel } from "@/components/govern/vote-panel"

async function getProposal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/proposals/${id}`, {
    // In Next.js, same-origin fetch works without base URL; fall back to relative
    cache: "no-store",
  }).catch(() => null)

  if (!res || !("ok" in res) || !res.ok) {
    // fallback relative
    const rel = await fetch(`/api/proposals/${id}`, { cache: "no-store" })
    if (!rel.ok) throw new Error("Failed to fetch proposal")
    return (await rel.json()) as any
  }
  return (await res.json()) as any
}

export default async function ProposalDetail({ params }: { params: { id: string } }) {
  const p = await getProposal(params.id)

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">{p.title}</h1>
        <p className="text-muted-foreground">{p.summary}</p>
      </header>

      <article className="rounded-lg border border-border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-medium text-foreground">Details</h2>
        <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{p.body}</pre>
      </article>

      <div className="mt-6">
        <VotePanel proposalId={p.id} disabled={p.status !== "active"} />
      </div>
    </main>
  )
}
