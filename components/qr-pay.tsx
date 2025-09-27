"use client"

import { useEffect, useState } from "react"

// Lightweight QR generation using canvas; avoids extra deps
export function QRPay({ amount, reference }: { amount: number; reference: string }) {
  const [src, setSrc] = useState<string>("")

  useEffect(() => {
    const payload = `PAY|HSHIELD|REF=${reference}|AMT=${amount}|CUR=KES`
    // Generate QR via a simple API (built-in canvas drawing using a tiny library substitute)
    // To keep the bundle small in this prototype, use a public QR endpoint-free approach:
    import("qrcode").then((QR) => {
      QR.toDataURL(payload, { errorCorrectionLevel: "M", margin: 1, width: 256 })
        .then(setSrc)
        .catch(() => setSrc(""))
    })
  }, [amount, reference])

  if (!amount) {
    return <div className="text-sm text-muted-foreground">Add items to see a payment QR.</div>
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
      {src ? (
        <img src={src || "/placeholder.svg"} alt="QR code for mobile money payment" className="h-48 w-48" />
      ) : (
        <div className="text-sm text-muted-foreground">Generating QR…</div>
      )}
      <div className="text-center text-sm">
        Reference: <span className="font-medium">{reference}</span>
        <br />
        Amount: <span className="font-medium">KES {amount.toLocaleString()}</span>
      </div>
    </div>
  )
}
