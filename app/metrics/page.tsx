"use client"

import useSWR from "swr"
import { StatsCards } from "@/components/metrics/stats-cards"
import { ActivityChart } from "@/components/metrics/activity-chart"
import { EcoScore } from "@/components/metrics/eco-score"
import { Badges } from "@/components/metrics/badges"
import { Leaderboard } from "@/components/metrics/leaderboard"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MetricsPage() {
  const { data, error, isLoading } = useSWR<{
    totals: { totalValueUSD: number; totalTokens: number; beneficiaries: number; txCount30d: number }
    series: Array<{ date: string; txCount: number; newUsers: number; carbonSavedKg: number }>
    ecoScore: { value: number; drivers: Array<{ id: string; label: string; weight: number; score: number }> }
    badges: Array<{ id: string; name: string; description: string; earned: boolean; earnedAt?: number }>
    leaderboard: Array<{ id: string; name: string; score: number }>
    updatedAt: number
  }>("/api/metrics", fetcher)

  return (
    <main className="mx-auto w-full max-w-6xl p-4">
      <Header />

      <header className="mb-4">
        <h1 className="text-balance text-2xl font-semibold text-foreground">Impact & Metrics</h1>
        <p className="text-pretty text-muted-foreground">
          Track real-time activity, impact, and progress. Earn badges as you grow the ecosystem.
        </p>
      </header>

      {isLoading ? <p className="text-muted-foreground">Loading metrics…</p> : null}
      {error ? <p className="text-destructive">Failed to load metrics.</p> : null}

      {data ? (
        <section className="grid gap-6">
          <StatsCards totals={data.totals} />

          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground">
            <h2 className="text-lg font-medium text-foreground">Activity (14 days)</h2>
            <div className="mt-4">
              <ActivityChart series={data.series} />
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <EcoScore score={data.ecoScore} />
            <Leaderboard items={data.leaderboard} />
          </section>

          <Separator />

          <Badges badges={data.badges} />

          <p className="text-xs text-muted-foreground">Last updated: {new Date(data.updatedAt).toLocaleString()}</p>
        </section>
      ) : null}
    </main>
  )
}
