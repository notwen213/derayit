type DayPoint = {
  date: string
  txCount: number
  newUsers: number
  carbonSavedKg: number
}

type Badge = {
  id: string
  name: string
  description: string
  earned: boolean
  earnedAt?: number
}

function daysBack(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

function genSeries(len = 14): DayPoint[] {
  const arr: DayPoint[] = []
  for (let i = len - 1; i >= 0; i--) {
    const base = Math.floor(10 + Math.random() * 50)
    const tx = base + Math.floor(Math.random() * 20 - 10)
    const nu = Math.max(0, Math.floor(base / 5 + Math.random() * 6 - 3))
    const carbon = Math.max(0, Math.floor(tx * 0.7 + Math.random() * 8))
    arr.push({
      date: fmt(daysBack(i)),
      txCount: Math.max(0, tx),
      newUsers: nu,
      carbonSavedKg: carbon,
    })
  }
  return arr
}

export async function GET() {
  const series = genSeries(14)
  const totals = {
    totalValueUSD: 1_275_000,
    totalTokens: 482,
    beneficiaries: 1_126,
    txCount30d: series.reduce((a, b) => a + b.txCount, 0),
  }

  const ecoScore = {
    value: 78, // out of 100
    drivers: [
      { id: "green_suppliers", label: "Green suppliers", weight: 0.35, score: 82 },
      { id: "local_distribution", label: "Local distribution", weight: 0.25, score: 74 },
      { id: "waste_reduction", label: "Waste reduction", weight: 0.2, score: 76 },
      { id: "energy_efficiency", label: "Energy efficiency", weight: 0.2, score: 80 },
    ],
  }

  const badges: Badge[] = [
    {
      id: "starter",
      name: "Getting Started",
      description: "Create your first token",
      earned: true,
      earnedAt: Date.now() - 9 * 86400000,
    },
    {
      id: "impact10",
      name: "Impact 10",
      description: "Reach 10 successful payouts",
      earned: true,
      earnedAt: Date.now() - 4 * 86400000,
    },
    {
      id: "eco50",
      name: "Eco 50+",
      description: "Eco-score above 50",
      earned: true,
      earnedAt: Date.now() - 2 * 86400000,
    },
    { id: "community", name: "Community Builder", description: "5 governance votes cast", earned: false },
    { id: "impact100", name: "Impact 100", description: "Reach 100 successful payouts", earned: false },
  ]

  const leaderboard = [
    { id: "0.0.1001", name: "Coop Kwanza", score: 1240 },
    { id: "0.0.1002", name: "Green Harvest", score: 1120 },
    { id: "0.0.1003", name: "Sunrise Foods", score: 990 },
    { id: "0.0.1004", name: "Village Trust", score: 880 },
    { id: "0.0.1005", name: "AgroLink", score: 850 },
  ]

  return new Response(
    JSON.stringify({
      totals,
      series,
      ecoScore,
      badges,
      leaderboard,
      updatedAt: Date.now(),
    }),
    { headers: { "Content-Type": "application/json" } },
  )
}
