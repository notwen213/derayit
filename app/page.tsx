import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { OfflineBanner } from "@/components/offline-banner"
import { useI18n } from "@/components/i18n-provider"
import Link from "next/link"

export default function HomePage() {
  // Use a client child to access translations
  return (
    <main className="min-h-dvh">
      <Header />
      <section className="px-4 py-10 md:py-12">
        <div className="mx-auto max-w-5xl">
          <Hero />
          <NavGrid />
        </div>
      </section>
      <OfflineBanner />
    </main>
  )
}

function Hero() {
  const { t } = useI18n()
  return (
    <header className="mb-8 text-center">
      <h1 className="text-balance text-3xl font-semibold md:text-4xl">{t("app.title")}</h1>
      <p className="text-pretty mt-3 text-sm text-muted-foreground md:text-base">{t("app.tagline")}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button className="bg-primary text-primary-foreground hover:opacity-90">{t("cta.getStarted")}</Button>
        <Button variant="secondary">{t("cta.learnMore")}</Button>
      </div>
    </header>
  )
}

function NavGrid() {
  const { t } = useI18n()
  const items = [
    { key: "nav.marketplace", href: "/marketplace", desc: "Buy & sell safely" },
    { key: "nav.verify", href: "/verify", desc: "Verify gov't payments" },
    { key: "nav.tokenize", href: "/tokenize", desc: "Tokenize real-world assets" },
    { key: "nav.govern", href: "/govern", desc: "Community DAO approvals" },
    { key: "nav.dashboard", href: "/metrics", desc: "Risk, eco-score, badges" },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <Link key={it.key} href={it.href} aria-label={t(it.key)} className="group block focus:outline-none">
          <Card className="transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring">
            <CardHeader>
              <CardTitle className="text-lg">{t(it.key)}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{it.desc}</CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
