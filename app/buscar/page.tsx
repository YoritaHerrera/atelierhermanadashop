import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Buscar | Atelier Hermanada",
  description: "Encuentra tus piezas artesanales favoritas.",
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-10">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold">Buscar</h1>
            <p className="mt-2 text-muted-foreground">Explora todas nuestras creaciones artesanales.</p>
          </div>
        </div>
        <div className="container py-16 text-center">
          <p className="mx-auto max-w-md text-muted-foreground">Consulta el catálogo completo y descubre una pieza hecha especialmente para ti.</p>
          <Button asChild className="mt-6"><Link href="/productos">Ver productos</Link></Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
