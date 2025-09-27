"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ActivityChart({
  series,
}: {
  series: Array<{ date: string; txCount: number; newUsers: number; carbonSavedKg: number }>
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="txCount" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="newUsers" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
