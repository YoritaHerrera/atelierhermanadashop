"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleFavorite } from "@/lib/favorites-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  productId,
  initialIsFavorite = false,
  className,
}: {
  productId: string
  initialIsFavorite?: boolean
  className?: string
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    const result = await toggleFavorite(productId)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
      if (result.error.includes("iniciar sesión")) {
        router.push("/auth/login")
      }
    } else {
      setIsFavorite(result.action === "added")
      toast({ title: result.action === "added" ? "Agregado a favoritos" : "Eliminado de favoritos" })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn("h-8 w-8 rounded-full", className)}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-current text-red-500")} />
      <span className="sr-only">{isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}</span>
    </Button>
  )
}
