import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight } from "lucide-react"

export default async function CollectionsPage() {
  const supabase = await createClient()

  const { data: collections } = await supabase.from("collections").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Colecciones</h1>
            <p className="mt-2 text-muted-foreground">Explora nuestras colecciones temáticas únicas</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2">
            {collections?.map((collection) => (
              <Card
                key={collection.id}
                className="group overflow-hidden border-border/50 transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={collection.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="mb-2 font-serif text-2xl font-bold">{collection.name}</h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{collection.description}</p>
                  <Button asChild>
                    <Link href={`/colecciones/${collection.slug}`}>
                      Ver Colección
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
