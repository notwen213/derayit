import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type VerifyResult = {
  status: "valid" | "already_redeemed" | "expired" | "invalid"
  code: string
  program: string
  issuer: string
  amount: number
  currency: string
  beneficiary?: string
  timestamp: number
  hcsTopicId?: string
  messageId?: string
  signatureValid?: boolean
}

function statusLabel(s: VerifyResult["status"]) {
  switch (s) {
    case "valid":
      return { text: "Valid", variant: "default" as const }
    case "already_redeemed":
      return { text: "Already redeemed", variant: "secondary" as const }
    case "expired":
      return { text: "Expired", variant: "outline" as const }
    default:
      return { text: "Invalid", variant: "destructive" as const }
  }
}

export function ResultCard({ result }: { result: VerifyResult }) {
  const s = statusLabel(result.status)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Verification Status</CardTitle>
          <Badge variant={s.variant}>{s.text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Reference</span>
          <span className="font-medium text-foreground">{result.code}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Program</span>
          <span className="font-medium text-foreground">{result.program}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Issuer</span>
          <span className="font-medium text-foreground">{result.issuer}</span>
        </div>
        {result.beneficiary ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Beneficiary</span>
            <span className="font-medium text-foreground">{result.beneficiary}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium text-foreground">
            {result.amount} {result.currency}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Timestamp</span>
          <span className="font-medium text-foreground">{new Date(result.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Signature</span>
          <span className="font-medium text-foreground">{result.signatureValid ? "Valid" : "Unavailable"}</span>
        </div>
        {result.hcsTopicId || result.messageId ? (
          <div className="rounded-md border border-border bg-muted/30 p-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">HCS Topic</span>
              <span className="font-medium text-foreground">{result.hcsTopicId ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Message</span>
              <span className="font-medium text-foreground">{result.messageId ?? "—"}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
