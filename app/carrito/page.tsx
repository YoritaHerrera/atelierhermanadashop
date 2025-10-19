import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CartItemsList } from "@/components/cart-items-list"
import { getCartItems } from "@/lib/cart-actions"
import Link from "next/link"

export default async function CartPage() {
  const { items, total } = await getCartItems()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Carrito de Compras</h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} {items.length === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>
        </div>

        <div className="container py-8">
          {items.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 text-6xl">🛍️</div>
              <h2 className="mb-2 font-serif text-2xl font-bold">Tu carrito está vacío</h2>
              <p className="mb-6 text-muted-foreground">Agrega productos para comenzar tu compra</p>
              <Button asChild size="lg">
                <Link href="/productos">Explorar Productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              <div>
                <CartItemsList items={items} />
              </div>

              <div>
                <Card className="sticky top-20 border-border/50">
                  <CardContent className="p-6">
                    <h2 className="mb-4 font-serif text-xl font-bold">Resumen del Pedido</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-semibold">Calculado en checkout</span>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="flex justify-between">
                        <span className="font-serif text-lg font-bold">Total</span>
                        <span className="font-serif text-lg font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="mt-6 w-full" size="lg" asChild>
                      <Link href="/checkout">Proceder al Pago</Link>
                    </Button>

                    <Button variant="outline" className="mt-3 w-full bg-transparent" asChild>
                      <Link href="/productos">Continuar Comprando</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
