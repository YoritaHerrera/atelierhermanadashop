import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, ShoppingBag, List, User, Package } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user stats
  const [ordersResult, favoritesResult, wishlistsResult] = await Promise.all([
    supabase.from("orders").select("id, status, total", { count: "exact" }).eq("user_id", user.id),
    supabase.from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("shared_wishlists").select("id", { count: "exact" }).eq("user_id", user.id),
  ])

  const ordersCount = ordersResult.count || 0
  const favoritesCount = favoritesResult.count || 0
  const wishlistsCount = wishlistsResult.count || 0

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, created_at, status, total")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-balance">Mi Cuenta</h1>
        <p className="text-muted-foreground">Bienvenida de vuelta, {user.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-mystical-purple/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <Package className="h-4 w-4 text-mystical-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos realizados</p>
          </CardContent>
        </Card>

        <Card className="border-mystical-pink/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Heart className="h-4 w-4 text-mystical-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoritesCount}</div>
            <p className="text-xs text-muted-foreground">Productos guardados</p>
          </CardContent>
        </Card>

        <Card className="border-mystical-gold/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listas</CardTitle>
            <List className="h-4 w-4 text-mystical-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlistsCount}</div>
            <p className="text-xs text-muted-foreground">Listas de deseos creadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuenta</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activa</div>
            <p className="text-xs text-muted-foreground">Estado de la cuenta</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:border-mystical-purple/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-mystical-purple" />
              Mis Pedidos
            </CardTitle>
            <CardDescription>Ver historial de compras y seguimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/pedidos">Ver Pedidos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-mystical-pink/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-mystical-pink" />
              Mis Favoritos
            </CardTitle>
            <CardDescription>Productos que has guardado</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/favoritos">Ver Favoritos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-mystical-gold/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-mystical-gold" />
              Mis Listas
            </CardTitle>
            <CardDescription>Listas de deseos compartibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/listas">Ver Listas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {recentOrders && recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Tus últimas compras en Atelier Hermanada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-mystical-purple/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/pedido/${order.id}`}>Ver</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {ordersCount > 3 && (
              <div className="mt-4 text-center">
                <Button asChild variant="link">
                  <Link href="/dashboard/pedidos">Ver todos los pedidos</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!recentOrders || recentOrders.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Comienza tu Viaje</CardTitle>
            <CardDescription>Aún no has realizado ningún pedido</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Explora nuestras creaciones artesanales y encuentra piezas únicas para tu alma
            </p>
            <Button asChild>
              <Link href="/productos">Explorar Productos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
