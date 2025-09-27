import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  // In future: verify signature, submit to HCS, update Mirror-indexed tallies.
  return new Response(JSON.stringify({ accepted: true, received: body }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
