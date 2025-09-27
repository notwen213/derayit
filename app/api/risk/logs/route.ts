import type { NextRequest } from "next/server"

type MirrorMessages = {
  messages?: Array<{
    consensus_timestamp?: string
    message?: string
    running_hash?: string
    sequence_number?: number
    topic_id?: string
  }>
}

async function tryFetch(url: string) {
  const res = await fetch(url, { cache: "no-store" }).catch(() => null)
  if (!res || !("ok" in res) || !res.ok) return null
  return (await res.json()) as any
}

export async function GET(_req: NextRequest) {
  const mirror = process.env.HEDERA_MIRROR_BASE_URL
  const topic = process.env.HEDERA_TOPIC_ID
  if (!mirror || !topic) {
    return new Response(
      JSON.stringify({ items: [], note: "Mirror Node or Topic not configured. Returning empty logs." }),
      { headers: { "Content-Type": "application/json" } },
    )
  }
  const url = `${mirror.replace(/\/$/, "")}/api/v1/topics/${encodeURIComponent(topic)}/messages?limit=20&order=desc`
  const data = (await tryFetch(url)) as MirrorMessages | null
  const items =
    data?.messages?.map((m) => {
      let parsed: any = null
      try {
        // Mirror returns base64-encoded 'message' by default in some versions; if already string JSON, try parse
        const raw = m.message ?? ""
        const maybe = (() => {
          try {
            // try base64
            return Buffer.from(raw, "base64").toString("utf-8")
          } catch {
            return String(raw)
          }
        })()
        parsed = JSON.parse(maybe)
      } catch {
        parsed = null
      }
      return {
        ts: m.consensus_timestamp,
        seq: m.sequence_number,
        topic: m.topic_id,
        message: parsed ?? m.message ?? null,
      }
    }) ?? []
  return new Response(JSON.stringify({ items }), { headers: { "Content-Type": "application/json" } })
}
