"use client"

import { useI18n } from "./i18n-provider"

const langs = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "yo", label: "Yorùbá" },
  { code: "ha", label: "Hausa" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "العربية" },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Language</span>
      <select
        className="rounded-md border bg-background px-2 py-1"
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        aria-label="Select language"
      >
        {langs.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}
