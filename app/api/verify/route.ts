import type { NextRequest } from "next/server"
import { verifyPaymentCodeViaMirror } from "@/lib/hedera"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get("code") || "").trim()

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Attempt Mirror Node verification first
  const mirrorResult = await verifyPaymentCodeViaMirror(code)
  if (mirrorResult) {
    const base = {
      code,
      program: "Agriculture Support 2025",
      issuer: "Ministry of Agriculture",
      amount: 12500,
      currency: "KES",
      beneficiary: "0.0.123456",
      timestamp: Date.now(),
      hcsTopicId: "0.0.4001",
      messageId: mirrorResult.meta?.transaction_id || `0.0.4001@${Date.now()}`,
      signatureValid: mirrorResult.status === "valid",
    }
    return new Response(JSON.stringify({ status: mirrorResult.status, ...base }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  // Simple scenarios for demo; replace with real Mirror Node/HCS lookups
  const base = {
    code,
    program: "Agriculture Support 2025",
    issuer: "Ministry of Agriculture",
    amount: 12500,
    currency: "KES",
    beneficiary: "0.0.123456",
    timestamp: Date.now(),
    hcsTopicId: "0.0.4001",
    messageId: `0.0.4001@${Date.now()}`,
    signatureValid: code.startsWith("OK"),
  }

  let status: "valid" | "already_redeemed" | "expired" | "invalid" = "invalid"
  if (code.startsWith("OK")) status = "valid"
  else if (code.startsWith("USED")) status = "already_redeemed"
  else if (code.startsWith("EXP")) status = "expired"

  return new Response(JSON.stringify({ status, ...base }), {
    headers: { "Content-Type": "application/json" },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as any)
  const code = String(body?.code || "").trim()
  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  const url = new URL(req.url)
  url.searchParams.set("code", code)
  return GET(new Request(url) as any)
}
