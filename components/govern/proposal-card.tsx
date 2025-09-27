import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ProposalCard({
  id,
  title,
  summary,
  status,
  yes,
  no,
  deadline,
}: {
  id: string
  title: string
  summary: string
  status: "active" | "queued" | "closed"
  yes: number
  no: number
  deadline: number
}) {
  const total = Math.max(yes + no, 1)
  const yesPct = Math.round((yes / total) * 100)
  const noPct = 100 - yesPct
  const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 86400000))

  return (
    <article className="grid gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <Badge variant={status === "active" ? "default" : status === "queued" ? "secondary" : "outline"}>
          {status}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{summary}</p>
      <div className="mt-1">
        <Progress value={yesPct} aria-label="Yes votes progress" />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Yes: {yes} ({yesPct}%)
          </span>
          <span>
            No: {no} ({noPct}%)
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Deadline: {daysLeft}d</span>
        <Link href={`/govern/${id}`} className="text-sm underline underline-offset-4">
          View details
        </Link>
      </div>
    </article>
  )
}
