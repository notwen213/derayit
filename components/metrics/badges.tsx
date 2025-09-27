import { Badge as UiBadge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Badge = {
  id: string
  name: string
  description: string
  earned: boolean
  earnedAt?: number
}

export function Badges({ badges }: { badges: Badge[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className="flex items-start justify-between rounded-lg border border-border bg-card/50 p-3"
              aria-live="polite"
            >
              <div>
                <div className="font-medium text-foreground">{b.name}</div>
                <div className="text-sm text-muted-foreground">{b.description}</div>
                {b.earnedAt ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Earned: {new Date(b.earnedAt).toLocaleDateString()}
                  </div>
                ) : null}
              </div>
              <UiBadge variant={b.earned ? "default" : "secondary"}>{b.earned ? "Earned" : "Locked"}</UiBadge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
