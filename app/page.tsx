import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock featured products
const mockFeaturedProducts = [
  {
    id: "1",
    name: "Cristales Púrpura",
    slug: "cristales-purpura",
    price: 45.99,
    image_url: "/placeholder.svg?key=t6hi5",
    material: { name: "Cuarzo" },
  },
  {
    id: "2",
    name: "Bordado Místico",
    slug: "bordado-mistico",
    price: 65.0,
    image_url: "/placeholder.svg?key=0oxv0",
    material: { name: "Bordado" },
  },
  {
    id: "3",
    name: "Cerámica Celestial",
    slug: "ceramica-celestial",
    price: 55.5,
    image_url: "/placeholder.svg?key=qajk0",
    material: { name: "Cerámica" },
  },
  {
    id: "4",
    name: "Resina Mágica",
    slug: "resina-magica",
    price: 38.0,
    image_url: "/placeholder.svg?key=n7apg",
    material: { name: "Resina" },
  },
  {
    id: "5",
    name: "Arcilla Polimérica",
    slug: "arcilla-polimerica",
    price: 42.0,
    image_url: "/placeholder.svg?key=q30bs",
    material: { name: "Arcilla Polimérica" },
  },
  {
    id: "6",
    name: "Yeso Artesanal",
    slug: "yeso-artesanal",
    price: 35.0,
    image_url: "/placeholder.svg?key=07947",
    material: { name: "Yeso" },
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            Atelier Hermanada
          </Link>
          <nav className="hidden gap-8 md:flex">
            <Link href="/productos" className="text-sm font-medium hover:text-primary">
              Productos
            </Link>
            <Link href="/colecciones" className="text-sm font-medium hover:text-primary">
              Colecciones
            </Link>
            <Link href="/acerca-de" className="text-sm font-medium hover:text-primary">
              Acerca de
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              Carrito
            </Button>
            <Button size="sm">Ingresar</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/40 bg-gradient-to-b from-background via-background to-card py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">
                ✨ Creaciones Artesanales Místicas
              </Badge>
              <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-balance md:text-6xl">
                Atelier Hermanada
              </h1>
              <p className="mb-4 font-serif text-xl text-muted-foreground text-pretty md:text-2xl">
                Creaciones del Alma
              </p>
              <p className="mb-8 text-lg text-muted-foreground text-pretty">
                Descubre accesorios únicos hechos a mano con amor: bordados, cerámica, resina, arcilla polimérica y más.
                Cada pieza cuenta una historia mágica.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/productos">Explorar Productos ✨</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/colecciones">Ver Colecciones</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section className="border-b border-border/40 bg-card/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-4">
                Nueva Colección
              </Badge>
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Colección Mística</h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty">
                Piezas inspiradas en la magia y el misticismo, creadas para conectar con tu esencia espiritual.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/colecciones/coleccion-mistica">Descubrir Colección</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Productos Destacados</h2>
              <p className="text-lg text-muted-foreground">Piezas únicas seleccionadas especialmente para ti</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockFeaturedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
                >
                  <Link href={`/productos/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Link href={`/productos/${product.slug}`}>
                          <h3 className="font-serif font-semibold transition-colors hover:text-primary">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.material?.name}</p>
                      </div>
                      <p className="font-serif text-lg font-semibold">${product.price}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      Agregar al Carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/productos">Ver Todos los Productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 bg-card/30 py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                  ✨
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Hecho a Mano</h3>
                <p className="text-sm text-muted-foreground">Cada pieza es única y creada con dedicación artesanal</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                  ♡
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Con Amor</h3>
                <p className="text-sm text-muted-foreground">Creaciones del alma para conectar con tu esencia</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                  📦
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Envío Seguro</h3>
                <p className="text-sm text-muted-foreground">Empacamos con cuidado para que llegue perfecto</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-serif text-lg font-semibold">Atelier Hermanada</h3>
              <p className="text-sm text-muted-foreground">
                Creaciones del alma hechas con amor y dedicación artesanal.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Tienda</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/productos" className="text-muted-foreground hover:text-primary">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/colecciones" className="text-muted-foreground hover:text-primary">
                    Colecciones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Información</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/acerca-de" className="text-muted-foreground hover:text-primary">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-muted-foreground hover:text-primary">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Síguenos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Atelier Hermanada. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
