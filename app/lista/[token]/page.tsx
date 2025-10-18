import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getSharedWishlist } from "@/lib/favorites-actions"
import Link from "next/link"
import { Gift, Heart } from "lucide-react"
import { notFound } from "next/navigation"

export default async function SharedWishlistPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const wishlist = await getSharedWishlist(token)

  if (!wishlist) {
    notFound()
  }

  const availableItems = wishlist.items.filter((item) => !item.is_purchased)
  const purchasedItems = wishlist.items.filter((item) => item.is_purchased)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">{wishlist.name}</h1>
              {wishlist.description && <p className="mb-4 text-lg text-muted-foreground">{wishlist.description}</p>}
              <p className="text-sm text-muted-foreground">
                Lista de deseos de {wishlist.profile?.full_name || "un usuario"}
              </p>
            </div>
          </div>
        </div>

        <div className="container py-12">
          {availableItems.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 font-serif text-2xl font-bold">Productos Disponibles</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableItems.map((item) => {
                  if (!item.product) return null

                  return (
                    <Card
                      key={item.id}
                      className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
                    >
                      <Link href={`/productos/${item.product.slug}`}>
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <img
                            src={item.product.image_url || "/placeholder.svg?height=400&width=400"}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Link href={`/productos/${item.product.slug}`}>
                              <h3 className="font-serif font-semibold transition-colors hover:text-primary">
                                {item.product.name}
                              </h3>
                            </Link>
                          </div>
                          <p className="font-serif text-lg font-semibold">${item.product.price}</p>
                        </div>
                        <AddToCartButton productId={item.product.id} className="w-full" />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {purchasedItems.length > 0 && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-bold">Productos Ya Regalados</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {purchasedItems.map((item) => {
                  if (!item.product) return null

                  return (
                    <Card key={item.id} className="overflow-hidden border-border/50 opacity-60">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={item.product.image_url || "/placeholder.svg?height=400&width=400"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Badge variant="secondary" className="gap-1">
                            <Heart className="h-3 w-3 fill-current" />
                            Ya Regalado
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif font-semibold">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Regalado por {item.purchased_by}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {wishlist.items.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Gift className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 font-serif text-2xl font-bold">Lista vacía</h2>
              <p className="text-muted-foreground">Esta lista no tiene productos aún</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
