"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createOrder } from "@/lib/order-actions"
import { validateDiscountCode } from "@/lib/discount-actions"
import { toast } from "@/hooks/use-toast"
import { Tag, X } from "lucide-react"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
  } | null
}

export function CheckoutForm({ items, subtotal }: { items: CartItem[]; subtotal: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Shipping form
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [phone, setPhone] = useState("")

  // Discount code
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string
    code: string
    amount: number
    type: string
    value: number
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({ title: "Ingresa un código de descuento", variant: "destructive" })
      return
    }

    setIsValidating(true)
    const result = await validateDiscountCode(discountCode, subtotal)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
    } else if (result.discount) {
      setAppliedDiscount(result.discount)
      toast({ title: "Código aplicado exitosamente" })
    }

    setIsValidating(false)
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode("")
  }

  const total = subtotal - (appliedDiscount?.amount || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !address || !city || !state || !zipCode || !phone) {
      toast({ title: "Por favor completa todos los campos", variant: "destructive" })
      return
    }

    setIsLoading(true)

    const result = await createOrder(
      {
        fullName,
        address,
        city,
        state,
        zipCode,
        phone,
      },
      appliedDiscount?.id,
      appliedDiscount?.amount,
    )

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
      setIsLoading(false)
    } else if (result.orderId) {
      toast({ title: "Orden creada exitosamente" })
      router.push(`/pedido/${result.orderId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Shipping Information */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">Información de Envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+52 123 456 7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Calle Principal 123"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Ciudad de México"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="CDMX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  placeholder="12345"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Products */}
              <div className="space-y-3">
                {items.map((item) => {
                  if (!item.product) return null

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.product.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Discount Code */}
              <div className="space-y-2">
                <Label htmlFor="discount">Código de Descuento</Label>
                {appliedDiscount ? (
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="flex-1 text-sm font-medium">{appliedDiscount.code}</span>
                    <span className="text-sm font-semibold text-primary">-${appliedDiscount.amount.toFixed(2)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleRemoveDiscount}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="discount"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="CODIGO10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={isValidating}
                      className="bg-transparent"
                    >
                      {isValidating ? "Validando..." : "Aplicar"}
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Descuento</span>
                    <span className="font-semibold text-primary">-${appliedDiscount.amount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">Gratis</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-serif text-lg font-bold">Total</span>
                  <span className="font-serif text-lg font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Procesando..." : "Confirmar Pedido"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Al confirmar, aceptas nuestros términos y condiciones
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
