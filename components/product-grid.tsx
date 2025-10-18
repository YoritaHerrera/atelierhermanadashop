"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Link from "next/link"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  material: { name: string; slug: string } | null
  collection: { name: string; slug: string } | null
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No se encontraron productos</p>
          <p className="mt-2 text-sm text-muted-foreground">Intenta ajustar los filtros</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-border/50 transition-all hover:shadow-lg">
            <Link href={`/productos/${product.slug}`}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image_url || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      // TODO: Add to favorites
                    }}
                  >
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
                    <h3 className="font-serif font-semibold transition-colors hover:text-primary">{product.name}</h3>
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
    </div>
  )
}
