import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserOrders } from "@/lib/order-actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const orders = await getUserOrders()

  const statusLabels = {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Mis Pedidos</h1>
            <p className="mt-2 text-muted-foreground">Revisa el estado de tus compras</p>
          </div>
        </div>

        <div className="container py-8">
          {orders.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 font-serif text-2xl font-bold">No tienes pedidos aún</h2>
              <p className="mb-6 text-muted-foreground">Comienza a explorar nuestros productos</p>
              <Button asChild size="lg">
                <Link href="/productos">Explorar Productos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-lg font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                          <Badge variant="secondary">{statusLabels[order.status as keyof typeof statusLabels]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-serif text-xl font-bold">${order.total.toFixed(2)}</p>
                        </div>
                        <Button asChild variant="outline" className="bg-transparent">
                          <Link href={`/pedido/${order.id}`}>Ver Detalles</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 flex gap-2 overflow-x-auto">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={item.product.image_url || "/placeholder.svg?height=64&width=64"}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
