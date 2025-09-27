type Proposal = {
  id: string
  title: string
  summary: string
  status: "active" | "queued" | "closed"
  yes: number
  no: number
  deadline: number // epoch ms
}

const PROPOSALS: Proposal[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  title: `Community Vote #${i + 1}`,
  summary:
    i % 2 === 0
      ? "Allocate treasury to rural cold-chain equipment."
      : "Set minimum verification quorum for crop tokens.",
  status: i % 3 === 0 ? "queued" : i % 3 === 1 ? "active" : "closed",
  yes: Math.floor(Math.random() * 500),
  no: Math.floor(Math.random() * 300),
  deadline: Date.now() + (i + 1) * 86400000,
}))

export async function GET() {
  return new Response(JSON.stringify(PROPOSALS), {
    headers: { "Content-Type": "application/json" },
  })
}
