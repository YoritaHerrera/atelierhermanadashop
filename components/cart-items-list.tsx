"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { updateCartItemQuantity, removeFromCart } from "@/lib/cart-actions"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    image_url: string | null
    stock: number
  } | null
}

export function CartItemsList({ items }: { items: CartItem[] }) {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setLoadingItems((prev) => new Set(prev).add(itemId))
    const result = await updateCartItemQuantity(itemId, newQuantity)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
    }

    setLoadingItems((prev) => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  const handleRemove = async (itemId: string) => {
    setLoadingItems((prev) => new Set(prev).add(itemId))
    const result = await removeFromCart(itemId)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
    } else {
      toast({ title: "Producto eliminado del carrito" })
    }

    setLoadingItems((prev) => {
      const next = new Set(prev)
      next.delete(itemId)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        if (!item.product) return null

        const isLoading = loadingItems.has(item.id)
        const subtotal = item.product.price * item.quantity

        return (
          <Card key={item.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Link href={`/productos/${item.product.slug}`} className="shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.product.image_url || "/placeholder.svg?height=100&width=100"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/productos/${item.product.slug}`}>
                      <h3 className="font-serif font-semibold transition-colors hover:text-primary">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="mt-1 font-serif text-lg font-semibold text-primary">${item.product.price}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (value > 0 && value <= item.product.stock) {
                            handleUpdateQuantity(item.id, value)
                          }
                        }}
                        className="h-8 w-16 text-center"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-serif font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemove(item.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
