"use client"

import Image from "next/image"
import { LanguageSwitcher } from "./language-switcher"
import { useI18n } from "./i18n-provider"

export function Header() {
  const { t } = useI18n()
  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src="/placeholder-logo.svg" alt="HederaShield logo" width={28} height={28} className="rounded" />
          <span className="text-base font-semibold">{t("app.name")}</span>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
