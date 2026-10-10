import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <header className="border-b border-border/40 bg-card/30 py-8">
        <div className="container">
          <h1 className="font-serif text-3xl font-bold">Productos</h1>
          <p className="mt-2 text-muted-foreground">Descubre nuestra colección de accesorios artesanales místicos</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Los productos se cargarán aquí una vez que ejecutes los scripts SQL</p>
          <p className="text-sm text-muted-foreground mt-4">
            Ejecuta los scripts en la carpeta /scripts para crear las tablas de la base de datos
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
