import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string; collection?: string; sort?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase.from("products").select("*, collection:collections(name, slug), material:materials(name, slug)")

  // Apply filters
  if (params.material) {
    const { data: material } = await supabase.from("materials").select("id").eq("slug", params.material).single()
    if (material) {
      query = query.eq("material_id", material.id)
    }
  }

  if (params.collection) {
    const { data: collection } = await supabase.from("collections").select("id").eq("slug", params.collection).single()
    if (collection) {
      query = query.eq("collection_id", collection.id)
    }
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`)
  }

  // Apply sorting
  if (params.sort === "price-asc") {
    query = query.order("price", { ascending: true })
  } else if (params.sort === "price-desc") {
    query = query.order("price", { ascending: false })
  } else if (params.sort === "name") {
    query = query.order("name", { ascending: true })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  // Fetch filter options
  const { data: materials } = await supabase.from("materials").select("*").order("name")
  const { data: collections } = await supabase.from("collections").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Productos</h1>
            <p className="mt-2 text-muted-foreground">Descubre nuestra colección de accesorios artesanales místicos</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-6">
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <ProductFilters materials={materials || []} collections={collections || []} />
              </Suspense>
            </aside>

            <div>
              <Suspense fallback={<div>Cargando productos...</div>}>
                <ProductGrid products={products || []} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
