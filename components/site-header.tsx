import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Atelier Hermanada" width={40} height={40} className="rounded-full" />
          <div className="hidden flex-col sm:flex">
            <span className="font-serif text-lg font-semibold leading-none">Atelier Hermanada</span>
            <span className="text-xs text-muted-foreground">Creaciones del Alma</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium transition-colors hover:text-primary">
            Productos
          </Link>
          <Link href="/colecciones" className="text-sm font-medium transition-colors hover:text-primary">
            Colecciones
          </Link>
          <Link href="/sobre-nosotros" className="text-sm font-medium transition-colors hover:text-primary">
            Sobre Nosotros
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/buscar">
              🔍<span className="sr-only">Buscar</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            🌙<span className="sr-only">Cambiar tema</span>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/favoritos">
              ♡<span className="sr-only">Favoritos</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/carrito">
              🛒<span className="sr-only">Carrito</span>
            </Link>
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                👤<span className="sr-only">Cuenta</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <details className="md:hidden">
            <summary className="cursor-pointer list-none">
              <Button variant="ghost" size="icon">
                ☰<span className="sr-only">Menú</span>
              </Button>
            </summary>
            <nav className="absolute right-0 top-16 w-48 rounded-lg border border-border/40 bg-background shadow-lg p-4 flex flex-col gap-4">
              <Link href="/" className="text-lg font-medium hover:text-primary">
                Inicio
              </Link>
              <Link href="/productos" className="text-lg font-medium hover:text-primary">
                Productos
              </Link>
              <Link href="/colecciones" className="text-lg font-medium hover:text-primary">
                Colecciones
              </Link>
              <Link href="/sobre-nosotros" className="text-lg font-medium hover:text-primary">
                Sobre Nosotros
              </Link>
              <div className="my-2 h-px bg-border" />
              <Link href="/buscar" className="text-lg font-medium hover:text-primary">
                🔍 Buscar
              </Link>
              <Link href="/dashboard" className="text-lg font-medium hover:text-primary">
                👤 Mi Cuenta
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
