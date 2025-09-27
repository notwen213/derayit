import type { NextRequest } from "next/server"
import { computeRisk, type RiskInput } from "@/lib/risk"
import { publishDecisionToHCS } from "@/lib/hedera"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    input: RiskInput
    explain?: boolean
    logToHCS?: boolean
  } | null

  if (!body?.input) {
    return new Response(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const result = computeRisk(body.input)

  let explanation: string | undefined
  if (body.explain) {
    try {
      const { text } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `Explain this fraud risk score in one concise paragraph for a non-technical reviewer. Input: ${JSON.stringify(
          body.input,
        )}. Score: ${JSON.stringify(result)}.`,
      })
      explanation = text
    } catch {
      explanation = "Explanation unavailable."
    }
  }

  let hcs: { messageId?: string } | undefined
  if (body.logToHCS) {
    try {
      hcs = await publishDecisionToHCS({
        kind: "risk_decision",
        at: Date.now(),
        input: body.input,
        result,
        explanation,
      })
    } catch {
      hcs = { messageId: undefined }
    }
  }

  return new Response(JSON.stringify({ result, explanation, hcs }), {
    headers: { "Content-Type": "application/json" },
  })
}
