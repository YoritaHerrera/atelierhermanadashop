import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getFavorites } from "@/lib/favorites-actions"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { FavoriteButton } from "@/components/favorite-button"
import Link from "next/link"
import { Heart } from "lucide-react"
import { CreateWishlistDialog } from "@/components/create-wishlist-dialog"

export default async function FavoritesPage() {
  const favorites = await getFavorites()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold md:text-4xl">Mis Favoritos</h1>
                <p className="mt-2 text-muted-foreground">
                  {favorites.length} {favorites.length === 1 ? "producto" : "productos"} guardados
                </p>
              </div>
              {favorites.length > 0 && <CreateWishlistDialog favorites={favorites.map((f) => f.product_id)} />}
            </div>
          </div>
        </div>

        <div className="container py-8">
          {favorites.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 font-serif text-2xl font-bold">No tienes favoritos aún</h2>
              <p className="mb-6 text-muted-foreground">Guarda productos que te gusten para verlos más tarde</p>
              <Button asChild size="lg">
                <Link href="/productos">Explorar Productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((favorite) => {
                if (!favorite.product) return null

                return (
                  <Card
                    key={favorite.id}
                    className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
                  >
                    <Link href={`/productos/${favorite.product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={favorite.product.image_url || "/placeholder.svg?height=400&width=400"}
                          alt={favorite.product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute right-2 top-2">
                          <FavoriteButton productId={favorite.product.id} initialIsFavorite={true} />
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link href={`/productos/${favorite.product.slug}`}>
                            <h3 className="font-serif font-semibold transition-colors hover:text-primary">
                              {favorite.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{favorite.product.material?.name}</p>
                        </div>
                        <p className="font-serif text-lg font-semibold">${favorite.product.price}</p>
                      </div>
                      <AddToCartButton productId={favorite.product.id} className="w-full" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
