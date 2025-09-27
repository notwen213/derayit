"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import { Button } from "@/components/ui/button"

export function parseQRText(text: string): string {
  // Accept raw code or URL schemes like hederashield://verify?code=XYZ
  try {
    if (text.startsWith("hederashield://") || text.startsWith("https://") || text.startsWith("http://")) {
      const url = new URL(text)
      const c = url.searchParams.get("code")
      if (c) return c
    }
  } catch {}
  // Simple pipe-delimited format: HSV1:CODE|AMOUNT|CURRENCY|TS|SIG
  if (text.startsWith("HSV1:")) {
    const parts = text.slice(5).split("|")
    if (parts[0]) return parts[0]
  }
  return text
}

export function QrScanner({ onResult }: { onResult: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    setScanning(false)
    setActive(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const tick = useCallback(() => {
    if (!active) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    ctx.drawImage(video, 0, 0, w, h)
    const imageData = ctx.getImageData(0, 0, w, h)
    const code = jsQR(imageData.data, w, h, { inversionAttempts: "dontInvert" })
    if (code?.data) {
      const parsed = parseQRText(code.data)
      onResult(parsed)
      stop()
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [active, onResult, stop])

  const start = async () => {
    setError(null)
    setActive(true)
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()
      rafRef.current = requestAnimationFrame(tick)
    } catch (e: any) {
      setError(e?.message ?? "Unable to access camera")
      stop()
    }
  }

  return (
    <div className="grid gap-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
        <video
          ref={videoRef}
          className="h-64 w-full object-cover"
          muted
          playsInline
          aria-label="Camera preview for scanning QR codes"
        />
        <canvas ref={canvasRef} className="hidden" aria-hidden />
      </div>
      <div className="flex items-center gap-2">
        {!scanning ? (
          <Button onClick={start}>Start scanning</Button>
        ) : (
          <Button variant="destructive" onClick={stop}>
            Stop
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          Position the QR within the frame. Scanning happens automatically.
        </span>
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
