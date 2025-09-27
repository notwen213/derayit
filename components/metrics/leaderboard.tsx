import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Leaderboard({
  items,
}: {
  items: Array<{ id: string; name: string; score: number }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2">
          {items.map((m, idx) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-border bg-card/50 p-2"
              aria-label={`Rank ${idx + 1} ${m.name}`}
            >
              <span className="text-foreground">
                {idx + 1}. {m.name}
              </span>
              <span className="text-muted-foreground">{m.score.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
