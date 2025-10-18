import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Atelier Hermanada" width={40} height={40} className="rounded-full" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold leading-none">Atelier Hermanada</span>
                <span className="text-xs text-muted-foreground">Creaciones del Alma</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Accesorios artesanales místicos hechos con amor y dedicación.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold">Tienda</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/productos" className="text-muted-foreground transition-colors hover:text-foreground">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/colecciones" className="text-muted-foreground transition-colors hover:text-foreground">
                  Colecciones
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?material=bordados"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Bordados
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?material=ceramica"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cerámica
                </Link>
              </li>
              <li>
                <Link
                  href="/productos?material=resina"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resina
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold">Información</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sobre-nosotros" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-muted-foreground transition-colors hover:text-foreground">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-muted-foreground transition-colors hover:text-foreground">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-semibold">Síguenos</h3>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                📷<span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                f<span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="mailto:hola@atelierhermanada.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                ✉<span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Atelier Hermanada. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
