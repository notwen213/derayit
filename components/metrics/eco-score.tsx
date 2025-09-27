"use client"

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function EcoScore({
  score,
}: {
  score: { value: number; drivers: Array<{ id: string; label: string; weight: number; score: number }> }
}) {
  const radialData = [{ name: "EcoScore", value: score.value, fill: "hsl(var(--primary))" }]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Eco-score</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar minAngle={15} background dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center text-xl font-semibold text-foreground">{score.value}/100</div>
        </div>
        <div className="grid gap-3">
          {score.drivers.map((d) => (
            <div key={d.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="text-foreground">{d.score}</span>
              </div>
              <Progress value={d.score} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
