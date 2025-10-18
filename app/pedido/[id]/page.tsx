import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrderById } from "@/lib/order-actions"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home } from "lucide-react"

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const statusConfig = {
    pending: { label: "Pendiente", icon: Package, color: "bg-yellow-500" },
    processing: { label: "Procesando", icon: Package, color: "bg-blue-500" },
    shipped: { label: "Enviado", icon: Truck, color: "bg-purple-500" },
    delivered: { label: "Entregado", icon: Home, color: "bg-green-500" },
    cancelled: { label: "Cancelado", icon: Package, color: "bg-red-500" },
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = currentStatus.icon

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Pedido Confirmado</h1>
              <p className="text-lg text-muted-foreground">
                Gracias por tu compra. Tu pedido ha sido recibido y está siendo procesado.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Número de pedido: {order.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Order Status */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Estado del Pedido</CardTitle>
                  <Badge variant="secondary" className="gap-2">
                    <div className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
                    {currentStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {Object.entries(statusConfig).map(([key, config], index) => {
                    const Icon = config.icon
                    const isActive = key === order.status
                    const isPast =
                      Object.keys(statusConfig).indexOf(key) < Object.keys(statusConfig).indexOf(order.status)

                    return (
                      <div key={key} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isActive || isPast ? config.color : "bg-muted"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${isActive || isPast ? "text-white" : "text-muted-foreground"}`}
                            />
                          </div>
                          <span className="mt-2 text-xs text-muted-foreground">{config.label}</span>
                        </div>
                        {index < Object.keys(statusConfig).length - 1 && (
                          <div className={`h-0.5 flex-1 ${isPast ? config.color : "bg-muted"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Dirección de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{order.shipping_address.fullName}</p>
                  <p className="text-muted-foreground">{order.shipping_address.address}</p>
                  <p className="text-muted-foreground">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                  </p>
                  <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.product.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <Link href={`/productos/${item.product.slug}`}>
                          <p className="font-medium transition-colors hover:text-primary">{item.product.name}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${(order.total + order.discount_amount).toFixed(2)}</span>
                  </div>

                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Descuento {order.discount?.code && `(${order.discount.code})`}
                      </span>
                      <span className="font-semibold text-primary">-${order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-semibold">Gratis</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-serif text-lg font-bold">Total</span>
                    <span className="font-serif text-lg font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button asChild className="flex-1" size="lg">
                <Link href="/productos">Seguir Comprando</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent" size="lg">
                <Link href="/dashboard/pedidos">Ver Mis Pedidos</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
