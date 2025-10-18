import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch collection
  const { data: collection } = await supabase.from("collections").select("*").eq("slug", slug).single()

  if (!collection) {
    notFound()
  }

  // Fetch products in collection
  const { data: products } = await supabase
    .from("products")
    .select("*, collection:collections(name, slug), material:materials(name, slug)")
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-12">
          <div className="container">
            <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/colecciones" className="hover:text-foreground">
                Colecciones
              </Link>
              <span>/</span>
              <span className="text-foreground">{collection.name}</span>
            </nav>
            <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">{collection.name}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{collection.description}</p>
          </div>
        </div>

        <div className="container py-12">
          <ProductGrid products={products || []} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
