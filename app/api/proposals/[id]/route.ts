import type { NextRequest } from "next/server"

type Proposal = {
  id: string
  title: string
  summary: string
  status: "active" | "queued" | "closed"
  yes: number
  no: number
  deadline: number
  body?: string
}

const cache = new Map<string, Proposal>()

function build(id: string): Proposal {
  if (cache.has(id)) return cache.get(id)!
  const p: Proposal = {
    id,
    title: `Community Vote #${id}`,
    summary: "Detailed governance proposal for HederaShield community.",
    status: Number(id) % 3 === 1 ? "active" : Number(id) % 3 === 2 ? "closed" : "queued",
    yes: Math.floor(Math.random() * 800),
    no: Math.floor(Math.random() * 600),
    deadline: Date.now() + Number(id) * 86400000,
    body: "Proposal details:\n\n- Objective: Improve verification throughput.\n- Budget: $12,500\n- Impact: Reduce fraud risk and increase payout speed.\n\nVoting power and quorum rules apply.",
  }
  cache.set(id, p)
  return p
}

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  const p = build(id)
  return new Response(JSON.stringify(p), {
    headers: { "Content-Type": "application/json" },
  })
}
