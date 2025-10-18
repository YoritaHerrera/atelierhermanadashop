"use server"

import { createClient } from "@/lib/supabase/server"

export async function validateDiscountCode(code: string, subtotal: number) {
  const supabase = await createClient()

  const { data: discount } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single()

  if (!discount) {
    return { error: "Código de descuento inválido" }
  }

  // Check if expired
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
    return { error: "Este código ha expirado" }
  }

  // Check minimum purchase
  if (discount.min_purchase && subtotal < discount.min_purchase) {
    return { error: `Compra mínima de $${discount.min_purchase} requerida` }
  }

  // Check max uses
  if (discount.max_uses && discount.current_uses >= discount.max_uses) {
    return { error: "Este código ha alcanzado su límite de usos" }
  }

  // Calculate discount amount
  let discountAmount = 0
  if (discount.discount_type === "percentage") {
    discountAmount = (subtotal * discount.discount_value) / 100
  } else {
    discountAmount = discount.discount_value
  }

  return {
    success: true,
    discount: {
      id: discount.id,
      code: discount.code,
      amount: discountAmount,
      type: discount.discount_type,
      value: discount.discount_value,
    },
  }
}
