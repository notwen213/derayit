"use client"
import { useState, useMemo } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type AssetDraft = {
  title: string
  description: string
  category: "agriculture" | "livestock" | "equipment" | "other"
  location: string
  quantity: number
  unit: string
  unitPriceUSD: number
  images: string[] // preview data URLs
}

function toDataURLs(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return Promise.resolve([])
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = reject
          reader.readAsDataURL(file)
        }),
    ),
  )
}

const defaultDraft: AssetDraft = {
  title: "",
  description: "",
  category: "agriculture",
  location: "",
  quantity: 1,
  unit: "kg",
  unitPriceUSD: 1,
  images: [],
}

export function AssetForm({
  onChange,
  onSubmit,
  className,
}: {
  onChange?: (draft: AssetDraft, valid: boolean) => void
  onSubmit?: (draft: AssetDraft) => void
  className?: string
}) {
  const [draft, setDraft] = useState<AssetDraft>(defaultDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const total = useMemo(() => draft.quantity * draft.unitPriceUSD, [draft.quantity, draft.unitPriceUSD])

  function validate(d: AssetDraft) {
    const e: Record<string, string> = {}
    if (!d.title.trim()) e.title = "Title is required"
    if (!d.location.trim()) e.location = "Location is required"
    if (d.quantity <= 0) e.quantity = "Quantity must be greater than 0"
    if (d.unitPriceUSD <= 0) e.unitPriceUSD = "Unit price must be greater than 0"
    return e
  }

  function update<K extends keyof AssetDraft>(key: K, value: AssetDraft[K]) {
    const next = { ...draft, [key]: value }
    const e = validate(next)
    setDraft(next)
    setErrors(e)
    onChange?.(next, Object.keys(e).length === 0)
  }

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const urls = await toDataURLs(e.target.files)
    update("images", urls)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const eMap = validate(draft)
    setErrors(eMap)
    if (Object.keys(eMap).length === 0) {
      onSubmit?.(draft)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "grid gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground",
        "md:grid-cols-2",
        className,
      )}
      aria-describedby="asset-form-help"
    >
      <div className="md:col-span-2">
        <p id="asset-form-help" className="text-sm text-muted-foreground">
          Provide accurate details so the community can verify and govern the asset effectively.
        </p>
      </div>

      <div>
        <Label htmlFor="title">Asset Title</Label>
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g., Maize harvest batch"
          aria-invalid={!!errors.title}
          aria-errormessage={errors.title ? "err-title" : undefined}
        />
        {errors.title ? (
          <p id="err-title" className="mt-1 text-sm text-destructive">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={draft.category} onValueChange={(v) => update("category", v as AssetDraft["category"])}>
          <SelectTrigger id="category" aria-label="Category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="livestock">Livestock</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={draft.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Short description to aid verification"
          className="min-h-24"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={draft.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g., Eldoret, Kenya"
          aria-invalid={!!errors.location}
          aria-errormessage={errors.location ? "err-location" : undefined}
        />
        {errors.location ? (
          <p id="err-location" className="mt-1 text-sm text-destructive">
            {errors.location}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            inputMode="numeric"
            value={draft.quantity}
            onChange={(e) => update("quantity", Number(e.target.value))}
            aria-invalid={!!errors.quantity}
            aria-errormessage={errors.quantity ? "err-qty" : undefined}
          />
          {errors.quantity ? (
            <p id="err-qty" className="mt-1 text-sm text-destructive">
              {errors.quantity}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={draft.unit}
            onChange={(e) => update("unit", e.target.value)}
            placeholder="kg, tons, heads"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="unitPriceUSD">Unit Price (USD)</Label>
        <Input
          id="unitPriceUSD"
          type="number"
          inputMode="decimal"
          value={draft.unitPriceUSD}
          onChange={(e) => update("unitPriceUSD", Number(e.target.value))}
          aria-invalid={!!errors.unitPriceUSD}
          aria-errormessage={errors.unitPriceUSD ? "err-price" : undefined}
        />
        {errors.unitPriceUSD ? (
          <p id="err-price" className="mt-1 text-sm text-destructive">
            {errors.unitPriceUSD}
          </p>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="images">Photos</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          aria-describedby="images-help"
        />
        <p id="images-help" className="mt-1 text-sm text-muted-foreground">
          Add 1–3 photos to aid verification. Do not upload sensitive info.
        </p>
        {draft.images.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {draft.images.slice(0, 3).map((src, idx) => (
              <img
                key={idx}
                src={src || "/placeholder.svg"}
                alt="Asset preview"
                className="h-24 w-full rounded-md object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="md:col-span-2 flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2">
        <span className="text-sm text-muted-foreground">Estimated total value</span>
        <strong className="text-foreground">${total.toLocaleString()}</strong>
      </div>

      <div className="md:col-span-2 flex items-center gap-2">
        <Button type="submit" className="shrink-0">
          Preview & tokenize
        </Button>
        <span className="text-sm text-muted-foreground">You can review details before submitting to the network.</span>
      </div>
    </form>
  )
}
