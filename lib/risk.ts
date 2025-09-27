export type RiskSubject = "payment" | "listing" | "beneficiary" | "withdrawal"

export type RiskInput = {
  subject: RiskSubject
  amount?: number // in minor units where possible
  currency?: string
  country?: string
  deviceTrust?: "low" | "medium" | "high"
  accountAgeDays?: number
  pastIncidents?: number // count of prior flags
  frequencyLast24h?: number // number of actions in last 24h
  mismatchedGeo?: boolean
  description?: string // free text context
}

export type RiskSignal = {
  id: string
  score: number // 0..100
  reason: string
  weight: number // contribution
}

export type RiskResult = {
  total: number
  band: "low" | "medium" | "high"
  signals: RiskSignal[]
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export function computeRisk(input: RiskInput): RiskResult {
  const signals: RiskSignal[] = []

  // Amount-based risk
  if (typeof input.amount === "number") {
    const amt = input.amount
    const amtScore = amt >= 1_000_000 ? 35 : amt >= 250_000 ? 20 : amt >= 50_000 ? 10 : amt >= 10_000 ? 5 : 1
    signals.push({
      id: "amt",
      score: amtScore,
      weight: 1,
      reason: "High transaction amount",
    })
  }

  // Device trust
  if (input.deviceTrust) {
    const map: Record<NonNullable<RiskInput["deviceTrust"]>, number> = {
      low: 20,
      medium: 8,
      high: 0,
    }
    signals.push({
      id: "device",
      score: map[input.deviceTrust],
      weight: 1,
      reason: `Device trust: ${input.deviceTrust}`,
    })
  }

  // Account age
  if (typeof input.accountAgeDays === "number") {
    const age = input.accountAgeDays
    const s = age < 3 ? 20 : age < 7 ? 12 : age < 30 ? 6 : 0
    signals.push({ id: "age", score: s, weight: 0.8, reason: "New account" })
  }

  // Frequency
  if (typeof input.frequencyLast24h === "number") {
    const f = input.frequencyLast24h
    const s = f >= 20 ? 25 : f >= 10 ? 12 : f >= 5 ? 6 : 0
    signals.push({ id: "freq", score: s, weight: 0.9, reason: "High recent activity" })
  }

  // Geo mismatch
  if (input.mismatchedGeo) {
    signals.push({ id: "geo", score: 18, weight: 1, reason: "Geo mismatch" })
  }

  // Past incidents
  if (typeof input.pastIncidents === "number" && input.pastIncidents > 0) {
    const s = clamp(input.pastIncidents * 6, 0, 30)
    signals.push({ id: "history", score: s, weight: 1, reason: "Prior flags/incidents" })
  }

  // Subject-specific adjustments
  if (input.subject === "listing") {
    // Listings with description missing may be suspicious
    if (!input.description || input.description.trim().length < 12) {
      signals.push({ id: "desc", score: 10, weight: 0.7, reason: "Insufficient description" })
    }
  }

  // Aggregate
  const raw = signals.reduce((acc, s) => acc + s.score * s.weight, 0)
  const total = clamp(Math.round(raw))
  const band: RiskResult["band"] = total >= 60 ? "high" : total >= 30 ? "medium" : "low"
  return { total, band, signals }
}
