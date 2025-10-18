import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select("*, collection:collections(name, slug), material:materials(name, slug)")
    .eq("slug", slug)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, material:materials(name)")
    .eq("material_id", product.material_id)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-foreground">
              Productos
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {product.collection && (
                    <Badge variant="secondary">
                      <Link href={`/colecciones/${product.collection.slug}`}>{product.collection.name}</Link>
                    </Badge>
                  )}
                  {product.material && <Badge variant="outline">{product.material.name}</Badge>}
                </div>
                <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">{product.name}</h1>
                <p className="font-serif text-3xl font-bold text-primary">${product.price}</p>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-lg font-semibold">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "Pieza artesanal única hecha con amor y dedicación."}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Stock disponible: <span className="font-semibold text-foreground">{product.stock} unidades</span>
                </p>
              </div>

              <div className="flex gap-3">
                <AddToCartButton productId={product.id} className="flex-1" />
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Agregar a favoritos</span>
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Compartir</span>
                </Button>
              </div>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <h3 className="mb-2 font-serif text-sm font-semibold">Información de Envío</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Envío a todo el país</li>
                    <li>• Tiempo de entrega: 5-7 días hábiles</li>
                    <li>• Empaque especial para proteger tu pieza</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-serif text-2xl font-bold">Productos Relacionados</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
                  >
                    <Link href={`/productos/${relatedProduct.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={relatedProduct.image_url || "/placeholder.svg?height=300&width=300"}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link href={`/productos/${relatedProduct.slug}`}>
                        <h3 className="mb-1 font-serif font-semibold transition-colors hover:text-primary">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{relatedProduct.material?.name}</p>
                      <p className="mt-2 font-serif font-semibold">${relatedProduct.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
