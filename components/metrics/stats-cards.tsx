import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards({
  totals,
}: {
  totals: { totalValueUSD: number; totalTokens: number; beneficiaries: number; txCount30d: number }
}) {
  const items = [
    { label: "Total Value", value: `$${totals.totalValueUSD.toLocaleString()}` },
    { label: "Tokens", value: totals.totalTokens.toLocaleString() },
    { label: "Beneficiaries", value: totals.beneficiaries.toLocaleString() },
    { label: "Tx (30d)", value: totals.txCount30d.toLocaleString() },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{it.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
