"use client"

import { Button } from "@/components/ui/button"
import { addToCart } from "@/lib/cart-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function AddToCartButton({ productId, className }: { productId: string; className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    const result = await addToCart(productId)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
      if (result.error.includes("iniciar sesión")) {
        router.push("/auth/login")
      }
    } else {
      toast({ title: "Producto agregado al carrito" })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} className={className}>
      🛒 {isLoading ? "Agregando..." : "Agregar al Carrito"}
    </Button>
  )
}
