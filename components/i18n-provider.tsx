"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { dictionaries, type Locale, tFactory } from "@/lib/i18n"

type Ctx = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof (typeof dictionaries)["en"]) => string
}

const I18nCtx = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  // load persisted choice
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("hs-locale") : null
    if (saved && saved in dictionaries) setLocale(saved as Locale)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hs-locale", locale)
      const isRTL = locale === "ar"
      document.documentElement.lang = locale
      document.documentElement.dir = isRTL ? "rtl" : "ltr"
    }
  }, [locale])

  const t = useMemo(() => tFactory(locale), [locale])

  const value: Ctx = { locale, setLocale, t }
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider")
  return ctx
}
