import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserWishlists } from "@/lib/favorites-actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Gift, Eye } from "lucide-react"
import { CopyLinkButton } from "@/components/copy-link-button"

export default async function UserWishlistsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const wishlists = await getUserWishlists()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold md:text-4xl">Mis Listas de Deseos</h1>
                <p className="mt-2 text-muted-foreground">Administra tus listas compartidas</p>
              </div>
              <Button asChild>
                <Link href="/favoritos">
                  <Gift className="mr-2 h-4 w-4" />
                  Crear Nueva Lista
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {wishlists.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Gift className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 font-serif text-2xl font-bold">No tienes listas aún</h2>
              <p className="mb-6 text-muted-foreground">Crea una lista desde tus favoritos para compartirla</p>
              <Button asChild size="lg">
                <Link href="/favoritos">Ir a Favoritos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlists.map((wishlist) => {
                const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/lista/${wishlist.share_token}`

                return (
                  <Card key={wishlist.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-xl">{wishlist.name}</CardTitle>
                          {wishlist.description && (
                            <p className="mt-2 text-sm text-muted-foreground">{wishlist.description}</p>
                          )}
                        </div>
                        <Badge variant={wishlist.is_active ? "default" : "secondary"}>
                          {wishlist.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {wishlist.items?.[0]?.count || 0} {wishlist.items?.[0]?.count === 1 ? "producto" : "productos"}
                      </p>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                          <Link href={`/lista/${wishlist.share_token}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Lista
                          </Link>
                        </Button>
                        <CopyLinkButton url={shareUrl} />
                      </div>
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
