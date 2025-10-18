import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm } from "@/components/checkout-form"
import { getCartItems } from "@/lib/cart-actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  const { items, total } = await getCartItems()

  if (items.length === 0) {
    redirect("/carrito")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="border-b border-border/40 bg-card/30 py-8">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold md:text-4xl">Finalizar Compra</h1>
            <p className="mt-2 text-muted-foreground">Completa tu información de envío</p>
          </div>
        </div>

        <div className="container py-8">
          <CheckoutForm items={items} subtotal={total} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
