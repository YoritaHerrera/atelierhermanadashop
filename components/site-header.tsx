"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Moon, Search, ShoppingCart, Sun, User, Heart, X } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()

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
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex" aria-label="Buscar">
            <Link href="/buscar">
              <Search aria-hidden="true" />
              <span className="sr-only">Buscar</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            <span className="sr-only">{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex" aria-label="Favoritos">
            <Link href="/favoritos">
              <Heart aria-hidden="true" />
              <span className="sr-only">Favoritos</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex" aria-label="Carrito">
            <Link href="/carrito">
              <ShoppingCart aria-hidden="true" />
              <span className="sr-only">Carrito</span>
            </Link>
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild aria-label="Cuenta">
              <Link href="/dashboard">
                <User aria-hidden="true" />
                <span className="sr-only">Cuenta</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <details className="relative md:hidden">
            <summary className="flex cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <Button variant="ghost" size="icon" asChild aria-label="Abrir menú">
                <span><Menu aria-hidden="true" /></span>
              </Button>
            </summary>
            <nav className="absolute right-0 top-12 z-50 flex w-64 flex-col gap-1 rounded-xl border border-border bg-background p-3 text-foreground shadow-xl">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navegación</p>
              <Link href="/" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Inicio</Link>
              <Link href="/productos" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Productos</Link>
              <Link href="/colecciones" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Colecciones</Link>
              <Link href="/sobre-nosotros" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Sobre Nosotros</Link>
              <div className="my-2 h-px bg-border" />
              <Link href="/buscar" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Buscar</Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">Mi Cuenta</Link>
              <div className="my-2 h-px bg-border" />
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modo de color</p>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={theme === "light" ? "secondary" : "ghost"} className="justify-start" onClick={() => theme === "dark" && toggleTheme()}>
                  <Sun data-icon="inline-start" /> Claro
                </Button>
                <Button type="button" variant={theme === "dark" ? "secondary" : "ghost"} className="justify-start" onClick={() => theme === "light" && toggleTheme()}>
                  <Moon data-icon="inline-start" /> Oscuro
                </Button>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
