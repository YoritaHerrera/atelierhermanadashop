import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Link from "next/link"
import { Sparkles, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, collection:collections(name), material:materials(name)")
    .eq("is_featured", true)
    .limit(6)

  // Fetch featured collection
  const { data: featuredCollection } = await supabase
    .from("collections")
    .select("*, products(count)")
    .eq("is_featured", true)
    .single()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-background to-card">
          <div className="stars-bg absolute inset-0 opacity-30" />
          <div className="container relative py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 gap-1">
                <Sparkles className="h-3 w-3" />
                Creaciones Artesanales Místicas
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
                  <Link href="/productos">
                    Explorar Productos
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/colecciones">Ver Colecciones</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        {featuredCollection && (
          <section className="border-b border-border/40 bg-card/30 py-16">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <Badge variant="outline" className="mb-4">
                  Nueva Colección
                </Badge>
                <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">{featuredCollection.name}</h2>
                <p className="mb-8 text-lg text-muted-foreground text-pretty">{featuredCollection.description}</p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/colecciones/${featuredCollection.slug}`}>Descubrir Colección</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Productos Destacados</h2>
              <p className="text-lg text-muted-foreground">Piezas únicas seleccionadas especialmente para ti</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts?.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
                >
                  <Link href={`/productos/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image_url || "/placeholder.svg?height=400&width=400"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute right-2 top-2">
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Agregar a favoritos</span>
                        </Button>
                      </div>
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
                    <AddToCartButton productId={product.id} className="w-full" />
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Hecho a Mano</h3>
                <p className="text-sm text-muted-foreground">Cada pieza es única y creada con dedicación artesanal</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Con Amor</h3>
                <p className="text-sm text-muted-foreground">Creaciones del alma para conectar con tu esencia</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {/* Placeholder for ShoppingCart icon import */}
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold">Envío Seguro</h3>
                <p className="text-sm text-muted-foreground">Empacamos con cuidado para que llegue perfecto</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
