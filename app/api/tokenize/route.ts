import type { NextRequest } from "next/server"
import { tokenizeAssetPlaceholder } from "@/lib/hedera"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  try {
    const data = await tokenizeAssetPlaceholder(body)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    // Fallback to previous mock
  }
  const tokenId = "0.0." + Math.floor(10000 + Math.random() * 90000)
  const messageId = `0.0.${Math.floor(2000 + Math.random() * 9000)}@${Date.now()}`
  return new Response(JSON.stringify({ tokenId, messageId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
