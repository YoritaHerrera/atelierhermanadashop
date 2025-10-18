"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type Material = {
  id: string
  name: string
  slug: string
}

type Collection = {
  id: string
  name: string
  slug: string
}

export function ProductFilters({ materials, collections }: { materials: Material[]; collections: Collection[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentMaterial = searchParams.get("material")
  const currentCollection = searchParams.get("collection")
  const currentSort = searchParams.get("sort") || "newest"

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/productos")
  }

  const hasFilters = currentMaterial || currentCollection || currentSort !== "newest"

  return (
    <div className="space-y-6">
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
          ✕ Limpiar Filtros
        </Button>
      )}

      {/* Sort */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold">Ordenar por</h3>
        <RadioGroup value={currentSort} onValueChange={(value) => updateFilter("sort", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest" className="cursor-pointer font-normal">
              Más recientes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="price-asc" />
            <Label htmlFor="price-asc" className="cursor-pointer font-normal">
              Precio: Menor a Mayor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="price-desc" />
            <Label htmlFor="price-desc" className="cursor-pointer font-normal">
              Precio: Mayor a Menor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="name" />
            <Label htmlFor="name" className="cursor-pointer font-normal">
              Nombre A-Z
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="h-px bg-border" />

      {/* Materials */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold">Materiales</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Checkbox
                id={material.slug}
                checked={currentMaterial === material.slug}
                onCheckedChange={(checked) => {
                  updateFilter("material", checked ? material.slug : null)
                }}
              />
              <Label htmlFor={material.slug} className="cursor-pointer font-normal">
                {material.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Collections */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold">Colecciones</h3>
        <div className="space-y-2">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center space-x-2">
              <Checkbox
                id={collection.slug}
                checked={currentCollection === collection.slug}
                onCheckedChange={(checked) => {
                  updateFilter("collection", checked ? collection.slug : null)
                }}
              />
              <Label htmlFor={collection.slug} className="cursor-pointer font-normal">
                {collection.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
